import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import useToast from "./Toast";
import api from "../../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [toastElement, showToast] = useToast();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.confirmPassword) {
      return showToast("Semua field wajib diisi", "danger");
    }
    if (form.password !== form.confirmPassword) {
      return showToast("Konfirmasi password tidak sama", "danger");
    }

    try {
      setLoading(true);
      const res = await api.post("/user/forgotpassword", {
        email: form.email,
        password: form.password,
      });

      if (!res.data.success) {
        return showToast(res.data.message, "danger");
      }

      showToast("Password berhasil diubah", "success");
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
          <div className="auth-icon">🔑</div>
          <h4 className="text-center mb-4">Reset Password</h4>

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
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              className="form-control mb-3"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="btn btn-primary-custom w-100"
              disabled={loading}
            >
              {loading ? "Loading..." : "Change Password"}
            </button>
          </form>

          <p className="text-center mt-4 small mb-0">
            <Link to="/login" style={{ color: "var(--brand)" }}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}