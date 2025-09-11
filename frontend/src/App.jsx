import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard.jsx";
import EquipmentList from "./components/EquipmentList.jsx";
import WorkOrderList from "./components/WorkOrderList.jsx";
import Reports from "./components/Reports.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    toast.success("Login successful!");
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast("Logged out", { icon: "👋" });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 font-sans">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <header className="flex items-center justify-between p-2 shadow bg-white/80 backdrop-blur sticky top-0 z-40">
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 tracking-tight drop-shadow-sm">
            Equipment Maintenance Tracker
          </h1>
          {user && <Navbar user={user} onLogout={handleLogout} />}
        </header>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipment"
            element={
              <ProtectedRoute user={user}>
                <EquipmentList token={token} user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workorders"
            element={
              <ProtectedRoute user={user}>
                <WorkOrderList token={token} user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute user={user}>
                <Reports token={token} user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
