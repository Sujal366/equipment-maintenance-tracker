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
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 font-sans">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-2 shadow bg-white/80 backdrop-blur sticky top-0 z-40">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow-sm whitespace-nowrap">
              Equipment Maintenance Tracker
            </h1>
            {/* Hamburger for mobile/tablet, only when menu is closed */}
            {user && !menuOpen && (
              <button
                className="lg:hidden text-indigo-700 focus:outline-none ml-2"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            {/* Close (X) icon when menu is open */}
            {user && menuOpen && (
              <button
                className="lg:hidden text-indigo-700 focus:outline-none ml-2"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          {/* Desktop navbar links inline (only on lg and up) */}
          {user && (
            <div className="hidden lg:block w-auto mt-2 lg:mt-0">
              <Navbar
                user={user}
                onLogout={handleLogout}
                open={true}
                setOpen={setMenuOpen}
              />
            </div>
          )}
        </header>
        {/* Navbar links below header for mobile and tablet, only when menu is open */}
        {user && menuOpen && (
          <div className="lg:hidden bg-white/90 backdrop-blur shadow-md border-b border-indigo-200 p-2">
            <Navbar
              user={user}
              onLogout={handleLogout}
              open={menuOpen}
              setOpen={setMenuOpen}
            />
          </div>
        )}
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
