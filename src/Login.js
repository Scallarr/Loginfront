import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [Gmail, setGmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://login-ue7d.onrender.com/login", {
        username,
        password
      });
 
      if (res.data.message === "Login success") {
          localStorage.setItem("token", res.data.token);
          navigate("/chat");
      }
    } 
 catch (err) {
  const status = err.response?.status;
  const message = err.response?.data?.message;

  if (status === 401 && message === "Email not verified") {
    navigate("/verify-otp", {
      state: { gmail: username }
    });
  } else {
    alert(message || "Login failed");
  }
}
  }

  return (
    <div style={{ minHeight: '100vh',   backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/2016/07/Free-4k-Backgrounds-Screen-Download.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',}}>
    <div
  style={{
    // background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(12px)", // รองรับ Safari
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

        <h2 style={{ marginBottom: 24, color: '#fcfcfc', fontWeight: 700, fontSize: 32, letterSpacing: 1 }}>Login</h2>

        <div style={{ width: '100%', marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#e7e4e4', marginBottom: 6, display: 'block' ,fontSize: 17 }}>Email</label>
          <input
            style={{ width: '100%',type:"email", boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
            placeholder="Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
{/* 
        <div style={{ width: '100%', marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#e7e4e4', marginBottom: 6, display: 'block' ,fontSize: 17 }}>Gmail</label>
          <input
            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 8 }}
            placeholder="Gmail"
            value={Gmail}
            onChange={e => setGmail(e.target.value)}
          />
        </div> */}

        <div style={{ width: '100%', marginBottom: 18 }}>
          <label style={{ fontWeight: 500, color: '#e7e4e4', marginBottom: 6, display: 'block' ,fontSize: 17 }}>Password</label>
          <input
            style={{ width: '100%',  boxSizing: 'border-box', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16, marginBottom: 25 }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div style={{ width: '100%', display: 'flex',flexDirection: 'column', justifyContent: 'center',alignItems: 'center'}}>
          <div  style={{ width: '100%', marginBottom: 10  , marginLeft: 0}}>

            <button
            onClick={handleLogin}
  style={{
    width: '100%',
    boxSizing: 'border-box', // ⭐ สำคัญ
    padding: '10px 16px',     // ลด padding นิดนึง
    background: 'linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(76,76,120,0.08)',
  }}
>
  Login
</button>
          </div>
        <div
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10
  }}
>
  <button
    onClick={() => navigate("/forgot")}
    style={{
      background: "none",
      border: "none",
      color: "#6c63ff",
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: 15
    }}
  >
    Forgot Password?
  </button>

  <span style={{ color: "#e7e4e4", margin: "0 8px" }}>|</span>

  <button
    onClick={() => navigate("/register")}
    style={{
      background: "none",
      border: "none",
      color: "#6c63ff",
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "underline",
      fontSize: 15
    }}
  >
    Create new account
  </button>
</div>

        </div>
        

        <div style={{ width: '100%', marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#a0aec0', fontSize: 14, marginBottom: 20 }}>or login with</span>
          <div style={{ width: "100%" }}>
            
       <GoogleLogin style={{ width: '300' , boxSizing: 'border-box',marginTop: '20px'}}
  onSuccess={async credentialResponse => {
    try {
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);

      console.log(payload); // 🔍 debug ดูของจริง

      const email = payload.email;
      const name = payload.name || payload.email;
      const picture =
  payload.picture

        const res = await axios.post('https://login-ue7d.onrender.com/addUser', {
      username: name,
      email: email,
      picture: picture
    });
  localStorage.setItem("token", res.data.token);
  navigate("/chat");
    } catch (err) {
      console.error(err);
      alert('Add user to DB failed');
    }
  }}
  
  onError={() => alert('Google Login Failed')}
  useOneTap
/>
</div>

        </div>
      </div>
    </div>
  );
}

export default Login;

