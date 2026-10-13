import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

export default function Navbar() {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar-custom">
      <Container className="d-flex justify-content-between align-items-center">
        <Link to="/" className="brand">
          RentEase
        </Link>

        <div className="d-flex align-items-center">
          {user ? (
            <>
              <span className="me-3">Hi, {user.name}</span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link-custom">Home</Link>
              <Link to="/login" className="nav-link-custom">Login</Link>
              <Link to="/register" className="btn btn-primary-custom btn-sm ms-3">
                Register
              </Link>
            </>
          )}
        </div>
      </Container>
    </nav>
  );
}