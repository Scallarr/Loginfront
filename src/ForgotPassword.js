import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [gmail, setGmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Step 1: ส่ง OTP ไปที่ gmail
  const handleSendOtp = async () => {
    if (!gmail) {
      alert("กรุณากรอก Gmail");
      return;
    }
    try {
      await axios.post("https://login-ue7d.onrender.com/forgot-password-otp", {
        gmail,
      });
      alert("ส่ง OTP ไปที่อีเมลแล้ว");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // Step 2: ยืนยัน OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("กรุณากรอก OTP");
      return;
    }
    try {
      await axios.post("https://login-ue7d.onrender.com/verify-forgot-otp", {
        gmail,
        otp,
      });
      setStep(3);
    } catch (err) {
      setOtp("");
      alert(err.response?.data?.message || "OTP ไม่ถูกต้อง");
    }
  };

  // Step 3: เปลี่ยนรหัสผ่าน
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("กรุณากรอกรหัสผ่านให้ครบ");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }
    try {
      const res = await axios.post(
        "https://login-ue7d.onrender.com/reset-password",
        { gmail, otp, newPassword }
      );
      alert(res.data.message || "เปลี่ยนรหัสผ่านสำเร็จ");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ส่ง OTP ใหม่
  const handleResendOtp = async () => {
    try {
      await axios.post("https://login-ue7d.onrender.com/forgot-password-otp", {
        gmail,
      });
      alert("ส่ง OTP ใหม่แล้ว");
      setOtp("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        {/* Step 1: กรอก Gmail */}
        {step === 1 && (
          <>
            <p style={styles.subtitle}>กรุณากรอก Gmail เพื่อรับ OTP</p>
            <div style={{ width: "100%", marginBottom: 16 }}>
              <label style={styles.label}>Gmail</label>
              <input
                style={styles.input}
                placeholder="example@gmail.com"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
              />
            </div>
            <button style={styles.button} onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: กรอก OTP */}
        {step === 2 && (
          <>
            <p style={styles.subtitle}>
              OTP ถูกส่งไปที่ <b>{gmail}</b>
            </p>
            <div style={{ width: "100%", marginBottom: 16 }}>
              <label style={styles.label}>OTP Code</label>
              <input
                style={{ ...styles.input, textAlign: "center", letterSpacing: 4 }}
                placeholder="6-digit"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
            <button style={styles.button} onClick={handleVerifyOtp}>
              Verify OTP
            </button>
            <span style={styles.link} onClick={handleResendOtp}>
              Send new OTP
            </span>
          </>
        )}

        {/* Step 3: ตั้งรหัสผ่านใหม่ */}
        {step === 3 && (
          <>
            <p style={styles.subtitle}>กรุณากรอกรหัสผ่านใหม่</p>
            <div style={{ width: "100%", marginBottom: 12 }}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div style={{ width: "100%", marginBottom: 16 }}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button style={styles.button} onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          Back to Login
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
    textAlign: "center",
  },
  label: {
    color: "#e7e4e4",
    fontSize: 16,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 16,
    marginTop: 6,
  },
  button: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    background: "linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(76,76,120,0.08)",
  },
  link: {
    color: "#000",
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: 12,
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#000",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 14,
    marginTop: 16,
    padding: 0,
  },
};

export default ForgotPassword;
