import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="flex items-center justify-between px-8 py-3 bg-white/90 rounded-lg max-w-4xl">
      <div className="flex items-center gap-6">
        {/* <span className="font-bold text-indigo-700 text-lg tracking-wide">
          EMT
        </span> */}
        <Link
          to="/"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Dashboard
        </Link>
        <Link
          to="/equipment"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Equipment
        </Link>
        <Link
          to="/workorders"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
        >
          Work Orders
        </Link>
        {user && (user.role === "Manager" || user.role === "Supervisor") && (
          <Link
            to="/reports"
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
          >
            Reports
          </Link>
        )}
      </div>
      {user && (
        <button
          onClick={onLogout}
          className="ml-4 px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
