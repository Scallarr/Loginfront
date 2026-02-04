import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp) {
      alert("กรุณากรอก OTP");
      return;
    }

    try {
    const res =  await axios.post("https://login-ue7d.onrender.com/verify-otp", {
        gmail: state.gmail,
        otp
      });


      if (res.data.message === "OTP verified") {
         localStorage.setItem("token", res.data.token);
      alert("ยืนยันอีเมลสำเร็จ");
    
      navigate("/dashboard");
      }
    } catch (err) {
         setOtp("");
      alert(err.response?.data?.message || "OTP ไม่ถูกต้อง");


    }
  };
  const handlenewotpVerify = async () => {

    try {
      await axios.post("https://login-ue7d.onrender.com/resend-otp", {
        gmail: state.gmail,
        
      });
        alert("ส่ง OTP ใหม่สำเร็จ");
         setOtp("");
     
    } catch (err) {
      alert(err.response?.data?.message || "OTP ไม่ถูกต้อง");
      setOtp("");
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
            marginBottom: 20,
            color: "#fcfcfc",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 1,
          }}
        >
          Verify OTP
        </h2>

        <p style={{ color: "#e7e4e4", fontSize: 15, marginBottom: 20 }}>
          OTP ถูกส่งไปที่ <br />
          <b>{state?.gmail}</b>
        </p>

        {/* OTP input */}
        <div style={{ width: "100%", marginBottom: 24 }}>
          <label style={{ color: "#e7e4e4", fontSize: 16 }}>
            OTP Code
          </label>
          <input
            style={inputStyle}
            placeholder="6-digit "
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
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
          Verify
        </button>
<div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  }}
>
  <span
    style={{
      color: "#000000",
      fontSize: 14,
      cursor: "pointer",
      textDecoration: "underline",
    }}
    onClick={handlenewotpVerify} // ถ้ามีฟังก์ชัน resend
  >
    Send new OTP
  </span>

  <button
    onClick={() => navigate("/")}
    style={{
      background: "none",
      border: "none",
      color: "#000000",
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: 14,
      padding: 0,
    }}
  >
    Back to Login
  </button>
</div>

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
  textAlign: "center",
  letterSpacing: 4,
};

export default VerifyOtp;
