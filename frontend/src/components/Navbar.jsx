import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout, open, setOpen }) {
  return (
    <nav className="w-full">
      <div
        className={`flex flex-col sm:flex-row gap-4 sm:gap-6 items-center px-4 sm:px-0 py-3 bg-white/90 rounded-lg sm:bg-transparent sm:rounded-none sm:py-0 sm:px-0 max-w-4xl sm:max-w-none mx-auto ${
          open ? "flex" : "hidden"
        } sm:flex`}
      >
        <Link
          to="/"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
          onClick={() => setOpen(false)}
        >
          Dashboard
        </Link>
        <Link
          to="/equipment"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
          onClick={() => setOpen(false)}
        >
          Equipment
        </Link>
        <Link
          to="/workorders"
          className="text-gray-700 hover:text-indigo-600 font-medium transition"
          onClick={() => setOpen(false)}
        >
          Work Orders
        </Link>
        {user && (user.role === "Manager" || user.role === "Supervisor") && (
          <Link
            to="/reports"
            className="text-gray-700 hover:text-indigo-600 font-medium transition"
            onClick={() => setOpen(false)}
          >
            Reports
          </Link>
        )}
        {user && (
          <button
            onClick={() => {
              onLogout();
              setOpen(false);
            }}
            className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
