import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("https://login-ue7d.onrender.com/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data); // 👈 object เดียว
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(60,60,120,0.15)",
          padding: 40,
          width: 400,
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            color: "#3a3a6c",
            fontWeight: 700,
            fontSize: 32,
            marginBottom: 24,
          }}
        >
          Dashboard
        </h2>

        {user && (
          <div
            style={{
              width: "100%",
              background: "#f5f6fa",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <img
              src={
                user.profile_image ||
                `https://ui-avatars.com/api/?name=${user.name}`
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${user.name}`;
              }}
              alt={user.name}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 16,
                border: "1px solid #e0eafc",
              }}
            />

            <div>
              <div
                style={{
                  color: "#3a3a6c",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  color: "#6c63ff",
                  fontSize: 15,
                }}
              >
                {user.email}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            background:
              "linear-gradient(90deg, #6c63ff 0%, #48c6ef 100%)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(76,76,120,0.08)",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
