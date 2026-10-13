import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import useToast from "./Toast";
import api from "../../api";

export default function Login() {
  const navigate = useNavigate();
  const [toastElement, showToast] = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return showToast("Email dan password wajib diisi", "danger");
    }

    try {
      setLoading(true);
      const res = await api.post("/user/login", form);

      if (!res.data.success) {
        return showToast(res.data.message, "danger");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const type = res.data.user.type;
      if (type === "Admin") navigate("/adminhome");
      else if (type === "Owner") navigate("/ownerhome");
      else navigate("/renterhome");
    } catch (error) {
      showToast(error.response?.data?.message || "Gagal terhubung ke server", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg">
      {toastElement}
      <Navbar />
      <div className="auth-wrapper">
        <div className="card-dark auth-card">
          <div className="auth-icon">🔒</div>
          <h4 className="text-center mb-4">Sign In</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              className="form-control mb-3"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              className="form-control mb-3"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="btn btn-primary-custom w-100"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="d-flex justify-content-between mt-4 small">
            <Link to="/forgotpassword" className="text-danger">
              Forgot Password?
            </Link>
            <Link to="/register" style={{ color: "var(--brand)" }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}