import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!username || !gmail || !newPassword) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await axios.post(
        "https://login-ue7d.onrender.com/forgot-password",
        {
          username,
          gmail,
          newPassword,
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.subtitle}>
          กรุณากรอกข้อมูลเพื่อรีเซ็ตรหัสผ่าน
        </p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Gmail"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage:
      "url('https://www.pixelstalk.net/wp-content/uploads/2016/07/Free-4k-Backgrounds-Screen-Download.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(60,60,120,0.15)",
    padding: 50,
    width: 350,
    maxWidth: "90vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    marginBottom: 8,
    color: "#fcfcfc",
    fontWeight: 700,
    fontSize: 32,
    letterSpacing: 1,
  },
  subtitle: {
    color: "#e7e4e4",
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 16px",
    background: "linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    marginTop: 8,
    boxShadow: "0 2px 8px rgba(76,76,120,0.08)",
  },
};

export default ForgotPassword;
