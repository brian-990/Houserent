import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import AdminHome from "./modules/admin/AdminHome";
import OwnerHome from "./modules/user/owner/OwnerHome";
import RenterHome from "./modules/user/renter/RenterHome";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

// halaman dashboard cuma bisa dibuka sesuai role
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = getUser();

  if (!token || !user) return <Navigate to="/login" replace />;
  if (role && user.type !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      <Route
        path="/adminhome"
        element={
          <ProtectedRoute role="Admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ownerhome"
        element={
          <ProtectedRoute role="Owner">
            <OwnerHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/renterhome"
        element={
          <ProtectedRoute role="Renter">
            <RenterHome />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;