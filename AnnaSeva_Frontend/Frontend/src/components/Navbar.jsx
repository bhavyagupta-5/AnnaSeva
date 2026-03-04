import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>
        <Link to="/dashboard" style={styles.link}>
          Annaseva
        </Link>
      </h2>

      <div style={styles.rightSection}>
        {user ? (
          <>
            <span style={styles.role}>
              Role: {user.role}
            </span>

            {user.role === "volunteer" && (
              <span style={styles.points}>
                Points: {user.rewardPoints || 0}
              </span>
            )}

            <button style={styles.button} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1f2937",
    color: "white",
  },
  logo: {
    margin: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginLeft: "15px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  role: {
    fontSize: "14px",
  },
  points: {
    fontSize: "14px",
    color: "#facc15",
  },
  button: {
    padding: "6px 12px",
    cursor: "pointer",
  },
};

export default Navbar;
