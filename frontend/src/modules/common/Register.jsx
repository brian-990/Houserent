import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import useToast from "./Toast";
import api from "../../api";

export default function Register() {
  const navigate = useNavigate();
  const [toastElement, showToast] = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.type) {
      return showToast("Semua field wajib diisi", "danger");
    }
    if (form.password.length < 6) {
      return showToast("Password minimal 6 karakter", "danger");
    }

    try {
      setLoading(true);
      const res = await api.post("/user/register", form);

      if (!res.data.success) {
        return showToast(res.data.message, "danger");
      }

      showToast("Registrasi berhasil, silakan login", "success");
      setTimeout(() => navigate("/login"), 1200);
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
          <div className="auth-icon">📝</div>
          <h4 className="text-center mb-4">Sign Up</h4>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              className="form-control mb-3"
              placeholder="Renter Full Name / Owner Name"
              value={form.name}
              onChange={handleChange}
            />
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
            <select
              name="type"
              className="form-select mb-3"
              value={form.type}
              onChange={handleChange}
            >
              <option value="">Select User Type</option>
              <option value="Renter">Renter</option>
              <option value="Owner">Owner</option>
            </select>
            <button
              type="submit"
              className="btn btn-primary-custom w-100"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 small mb-0">
            <span className="text-danger">Have an account? </span>
            <Link to="/login" style={{ color: "var(--brand)" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}