import { useEffect, useRef, useState } from "react";
import socket from "./socket";
import axios from "axios";
import "./Chat.css";

export default function Chat() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [target, setTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("https://login-ue7d.onrender.com/users", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMe(res.data));
  }, []);

  useEffect(() => {
    axios.get("https://login-ue7d.onrender.com/all-users").then(res => {
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages(prev => [...prev, data]);
    });
    return () => socket.off("receiveMessage");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectUser = async (u) => {
    setTarget(u);
    setMessages([]);

    const res = await axios.get(
      `https://login-ue7d.onrender.com/chat-history/${u.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setMessages(res.data.map(m => ({
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      message: m.message
    })));

    socket.emit("joinRoom", {
      userId: me.id,
      targetId: u.id
    });
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

  if (!me) return <p>Loading...</p>;

  return (
    <div className="chat-container">

      {/* Sidebar */}
      <div className="chat-sidebar">
        <h3>Chats</h3>
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

      {/* Chat */}
      <div className="chat-main">
        {!target ? (
          <div className="chat-header">เลือกคนที่อยากคุย</div>
        ) : (
          <>
            <div className="chat-header">
              {target.name}
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message ${m.senderId === me.id ? "me" : "other"}`}
                >
                  {m.message}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input">
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
      </div>
    </div>
  );
}
