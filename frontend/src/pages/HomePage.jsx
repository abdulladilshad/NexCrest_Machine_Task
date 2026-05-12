import { useAuth } from "../context/AuthContext";

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Rajesh Electronics</h1>
        <div className="header-right">
          <span className="welcome-text">
            Hi, {user?.name} {user?.role === "admin" && "(Admin)"}
          </span>
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
