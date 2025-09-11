import React from "react";

function Reports({ token, user }) {
  if (!user || (user.role !== "Manager" && user.role !== "Supervisor")) {
    return (
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
            Reports
          </h2>
          <p className="text-center text-gray-500">
            You do not have access to view or download reports.
          </p>
        </div>
      </div>
    );
  }
  const download = async (type) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reports/${type}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 text-center">
          Reports
        </h2>
        <button
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition shadow"
          onClick={() => download("equipment-status")}
        >
          Equipment Status PDF
        </button>
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition shadow"
          onClick={() => download("workorder-summary")}
        >
          Work Order Summary PDF
        </button>
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition shadow"
          onClick={() => download("technician-workload")}
        >
          Technician Workload PDF
        </button>
      </div>
    </div>
  );
}

export default Reports;
