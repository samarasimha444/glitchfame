import { useNavigate } from "react-router-dom";

const UserProfile = ({ profile }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div>
        <strong>{profile.username}</strong>
      </div>

      <div>{profile.email}</div>

      <div>
        <span
          style={{
            ...styles.role,
            backgroundColor:
              profile.role === "ADMIN" ? "#ff4d4d" : "#4da6ff",
          }}
        >
          {profile.role}
        </span>
      </div>

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#111",
    color: "#fff",
    alignItems: "center",
  },
  role: {
    padding: "4px 10px",
    borderRadius: "5px",
    fontSize: "12px",
    color: "#fff",
  },
};

export default UserProfile;