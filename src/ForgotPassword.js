import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [gmail, setGmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);
  const [countdown, setCountdown] = useState(0);

useEffect(() => {
  if (countdown <= 0) return;

  const timer = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [countdown]);


  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = otp.split("");
    while (newOtp.length < 6) newOtp.push("");
    newOtp[index] = value.slice(-1);
    setOtp(newOtp.join(""));
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    setOtp(paste);
    const focusIndex = Math.min(paste.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

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
      setCountdown(300);
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
      setCountdown(300);
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
        {step === 2 && 
        (
          <>
            <p style={styles.subtitle}>
              OTP ถูกส่งไปที่ <b>{gmail}</b>
            </p>
            <div style={{ width: "100%", marginBottom: 0 }}>
              <label style={styles.label}>OTP Code</label>
              <div style={styles.otpContainer}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    style={styles.otpBox}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={handleOtpPaste}
                  />
                ))}
              </div>
            </div >
            <div style={{ width: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'end',alignItems: 'end'}}>
            {countdown > 0 ? (
              
              <p style={styles.countdown}>
                OTP จะหมดอายุใน{" "}
                <span style={styles.countdownTime}>
                  {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                  {String(countdown % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <p style={styles.countdownExpired}>OTP หมดอายุแล้ว กรุณาส่งใหม่</p>
            )}
            </div>
            <button
              style={{
                ...styles.button,
                ...(countdown <= 0 ? styles.buttonDisabled : {}),
              }}
              onClick={handleVerifyOtp}
              disabled={countdown <= 0}
            >
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
              <div style={styles.passwordWrapper}>
                <input
                  type={showNewPw ? "text" : "password"}
                  style={styles.passwordInput}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span style={styles.eyeBtn} onClick={() => setShowNewPw(!showNewPw)}>
                  {showNewPw ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <div style={{ width: "100%", marginBottom: 16 }}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPw ? "text" : "password"}
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span style={styles.eyeBtn} onClick={() => setShowConfirmPw(!showConfirmPw)}>
                  {showConfirmPw ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            <button style={styles.button} onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}
<div    style={{ width: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'end',alignItems: 'end'}}>
        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          Back to Login
        </button></div>
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
    fontWeight: 500,
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
  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginTop: 6,
  },
  passwordInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 40px 10px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 16,
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: 18,
    userSelect: "none",
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
    color: "#fffcfc",
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "underline",
    marginTop: 12,
  },
  
  countdown: {
    justifyContent: "end",
    color: "#e7e4e4",
    fontSize: 14,
    textAlign: "center",
    margin: "4px 0 12px",
  },
  countdownTime: {
    color: "#48c6ef",
    fontWeight: 700,
    fontSize: 16,
  },
  countdownExpired: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    margin: "4px 0 12px",
    fontWeight: 600,
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  otpContainer: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginTop: 6,
  },
  otpBox: {
    width: 42,
    height: 48,
    textAlign: "center",
    fontSize: 22,
    fontWeight: 600,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outline: "none",
  },
  backButton: {
    alignItems: "start",
    background: "none",
    border: "none",
    color: "#fbf2f2",
    fontWeight: 500,
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 14,
    marginTop: 16,
    padding: 0,
  },
};

export default ForgotPassword;
