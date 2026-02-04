import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [gmail, setGmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !gmail) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      await axios.post("https://login-ue7d.onrender.com/register", {
        username,
        password,
        password2,
        gmail
      });
    alert("ส่ง OTP ไปที่อีเมลแล้ว");
    navigate("/verify-otp", { state: { gmail } }); // ⭐ ไปหน้า OTP
    } catch (err) {
      alert("Register ไม่สำเร็จ: " + (err.response?.data?.message || "Error") );
    }
  };





  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://www.pixelstalk.net/wp-content/uploads/2016/07/Free-4k-Backgrounds-Screen-Download.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
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
        }}
      >
        <h2
          style={{
            marginBottom: 24,
            color: "#fcfcfc",
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: 1,
          }}
        >
          Register
        </h2>

        {/* Username */}
        <div style={{ width: "100%", marginBottom: 16 }}>
          <label style={{ color: "#e7e4e4", fontSize: 16 }}>Username</label>
          <input
            style={inputStyle}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Gmail */}
        <div style={{ width: "100%", marginBottom: 16 }}>
          <label style={{ color: "#e7e4e4", fontSize: 16 }}>Gmail</label>
          <input
            style={inputStyle}
            placeholder="example@gmail.com"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div style={{ width: "100%", marginBottom: 24 }}>
          <label style={{ color: "#e7e4e4", fontSize: 16 }}>Password</label>
          <input
            type="password"
            style={inputStyle}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Password */}
        <div style={{ width: "100%", marginBottom: 24 }}>
          <label style={{ color: "#e7e4e4", fontSize: 16 }}>Confirm Password</label>
          <input
            type="password"
            style={inputStyle}
            placeholder="Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(76,76,120,0.1)",
            marginBottom: 12,
          }}
        >
          Create Account
        </button>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: "#6c63ff",
            fontWeight: 500,
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: 15,
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 16,
  marginTop: 6,
};

export default Register;


