import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import axios from "axios";
import "./Chat.css";
import { toast } from "react-hot-toast";


export default function Chat() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [longPressMsg, setLongPressMsg] = useState(null);
  const longPressTimer = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

 useEffect(() => {
  if (!token) return;

  axios.get("https://login-ue7d.onrender.com/users", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setMe(res.data));
}, [token]);


  useEffect(() => {
    axios.get("https://login-ue7d.onrender.com/all-users").then(res => {
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages(prev => [...prev, data]);
    });
    socket.on("messageDeleted", ({ messageId }) => {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("messageDeleted");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


useEffect(() => {
  if (!me) return;
  socket.emit("joinUser", me.id);
}, [me]);


useEffect(() => {
  socket.on("messageBlocked", (data) => {
    toast.error(data.error || "ข้อความไม่เหมาะสม", {
      duration: 3000,
      style: {
        borderRadius: "10px",
        background: "#ff2c2c",
        color: "#fff",
      },
      icon: "⚠️",
    });
  });

  return () => socket.off("messageBlocked");
}, []);


// useEffect(() => {
//   socket.on("messageBlocked", (data) => {
//     Swal.fire({
//       icon: "warning",
//       title: "ข้อความไม่เหมาะสม",
//       text: data.error || "กรุณาใช้ถ้อยคำสุภาพ",
//       confirmButtonText: "เข้าใจแล้ว",
//       confirmButtonColor: "#ff4d4f",
//     });
//   });

//   return () => socket.off("messageBlocked");
// }, []);




  const selectUser = async (u) => {
    setTarget(u);
    setMessages([]);

    socket.emit("joinRoom", { userId: me.id, targetId: u.id });

    const res = await axios.get(
      `https://login-ue7d.onrender.com/chat-history/${u.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(res.data.map(m => ({
      id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      message: m.message,
      image: m.image,
      time: m.created_at
    })));
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      senderId: me.id,
      receiverId: target.id,
      message
    });

    setMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    socket.disconnect();
    navigate("/");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(
        "https://login-ue7d.onrender.com/upload-chat-image",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("sendMessage", {
        senderId: me.id,
        receiverId: target.id,
        image: res.data.url
      });
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleLongPressStart = (m) => {
    if (m.senderId !== me.id) return;
    longPressTimer.current = setTimeout(() => {
      setLongPressMsg(m);
    }, 500);
  };

  const handleLongPressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const handleDeleteMessage = async () => {
    if (!longPressMsg) return;
    try {
      await axios.delete(
        `https://login-ue7d.onrender.com/delete-message/${longPressMsg.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit("deleteMessage", {
        senderId: me.id,
        receiverId: target.id,
        messageId: longPressMsg.id
      });
      setMessages(prev => prev.filter(m => m.id !== longPressMsg.id));
    } catch {
      alert("ลบไม่สำเร็จ");
    }
    setLongPressMsg(null);
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (isSameDay(date, today)) return "วันนี้";
    if (isSameDay(date, yesterday)) return "เมื่อวานนี้";
    return date.toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
  };

  const shouldShowDateSeparator = (msgs, index) => {
    if (!msgs[index].time) return false;
    if (index === 0) return true;
    if (!msgs[index - 1].time) return true;
    const curr = new Date(msgs[index].time);
    const prev = new Date(msgs[index - 1].time);
    return curr.getFullYear() !== prev.getFullYear() ||
      curr.getMonth() !== prev.getMonth() ||
      curr.getDate() !== prev.getDate();
  };

  if (!me) return <p>Loading...</p>;

  return (
    <div className={`chat-container ${target ? "has-target" : ""}`}>

      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Chats</h3>
        </div>
        <div className="sidebar-users">
          {users.filter(u => u.id !== me.id).map(u => (
            <div
              key={u.id}
              className={`chat-user ${target?.id === u.id ? "active" : ""}`}
              onClick={() => selectUser(u)}
            >
              <div className="avatar">{u.name[0]}</div>
              {u.name}
            </div>
          ))}
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Chat */}
      <div className="chat-main">
        {!target ? (
          <div className="chat-header">เลือกคนที่อยากคุย</div>
        ) : (
          <>
            <div className="chat-header">
              <button className="back-btn" onClick={() => setTarget(null)}>←</button>
              {target.name}
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <Fragment key={i}>
                  {shouldShowDateSeparator(messages, i) && (
                    <div className="date-separator">
                      <span>{getDateLabel(m.time)}</span>
                    </div>
                  )}
                  <div className={`message-wrapper ${m.senderId === me.id ? "me" : "other"}`}>
                    <div
                      className={`message ${m.senderId === me.id ? "me" : "other"}`}
                      onMouseDown={() => handleLongPressStart(m)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(m)}
                      onTouchEnd={handleLongPressEnd}
                    >
                      {m.image && (
                        <img
                          src={m.image}
                          alt="chat"
                          className="chat-image"
                          onClick={(e) => { e.stopPropagation(); setPreviewImage(m.image); }}
                        />
                      )}
                      {m.message && <span>{m.message}</span>}
                    </div>
                    {m.time && (
                      <div className="message-time">
                        {new Date(m.time).toLocaleString("th-TH", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </div>
                </Fragment>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <button
                className="img-btn"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
              >
                {uploading ? "..." : "📷"}
              </button>
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="พิมพ์ข้อความ..."
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>ส่ง</button>
            </div>
          </>
          
        )}
        {longPressMsg && (
          <div className="delete-modal" onClick={() => setLongPressMsg(null)}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
              <p>ต้องการยกเลิกข้อความนี้?</p>
              <div className="delete-modal-actions">
                <button className="delete-confirm" onClick={handleDeleteMessage}>ยกเลิกข้อความ</button>
                <button className="delete-cancel" onClick={() => setLongPressMsg(null)}>ไม่</button>
              </div>
            </div>
          </div>
        )}
        {previewImage && (
  <div className="image-modal" onClick={() => setPreviewImage(null)}>
    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
      <span className="close-btn" onClick={() => setPreviewImage(null)}>
        ✕
      </span>
      <img src={previewImage} alt="preview" />
    </div>
  </div>
)}

      </div>
    </div>
  );
}

