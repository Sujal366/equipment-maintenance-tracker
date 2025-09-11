import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./Loader";
import Toast from "./Toast";

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [equipmentRes, workOrderRes] = await Promise.all([
          axios.get("http://localhost:5001/api/equipment", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("http://localhost:5001/api/workorders", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);
        const equipment = equipmentRes.data;
        const workOrders = workOrderRes.data;
        setStats({
          equipmentCount: equipment.length,
          outOfService: equipment.filter((eq) => eq.status === "Out of Service")
            .length,
          workOrderCount: workOrders.length,
          openWorkOrders: workOrders.filter((wo) => wo.status !== "Completed")
            .length,
        });
      } catch (err) {
        setToast({ message: "Failed to load dashboard stats", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">
          Welcome, {user.name}{" "}
          <span className="text-base text-gray-500 font-normal">
            ({user.role})
          </span>
        </h2>
        <p className="mb-6 text-gray-600">Select a section from the menu.</p>
        {loading ? (
          <Loader />
        ) : (
          stats && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-indigo-50 rounded-lg p-4 text-center shadow">
                <div className="text-3xl font-bold text-indigo-700">
                  {stats.equipmentCount}
                </div>
                <div className="text-gray-600">Equipment</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center shadow">
                <div className="text-3xl font-bold text-yellow-600">
                  {stats.outOfService}
                </div>
                <div className="text-gray-600">Out of Service</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center shadow">
                <div className="text-3xl font-bold text-blue-700">
                  {stats.workOrderCount}
                </div>
                <div className="text-gray-600">Work Orders</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center shadow">
                <div className="text-3xl font-bold text-green-700">
                  {stats.openWorkOrders}
                </div>
                <div className="text-gray-600">Open Work Orders</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;
