import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Rajesh Electronics</h1>
        <div className="header-right">
          <span className="welcome-text">
            Hi, {user?.name} {user?.role === "admin" && "(Admin)"}
          </span>
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")} className="nav-btn">
              Admin Panel
            </button>
          )}
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="home-content">
        <p>Products will appear here...</p>
      </main>
    </div>
  );
}

export default HomePage;
