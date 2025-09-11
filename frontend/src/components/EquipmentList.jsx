import React, { useEffect, useState } from "react";
import axios from "axios";
import EquipmentForm from "./EquipmentForm";
import Modal from "./Modal";

function EquipmentList({ token, user }) {
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchEquipment = () => {
    axios
      .get("http://localhost:5001/api/equipment", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEquipment(res.data))
      .catch((err) => setError("Failed to load equipment"));
  };

  useEffect(() => {
    fetchEquipment();
    // eslint-disable-next-line
  }, [token]);

  const filtered = equipment.filter(
    (eq) =>
      (!statusFilter || eq.status === statusFilter) &&
      (!search ||
        eq.name.toLowerCase().includes(search.toLowerCase()) ||
        eq.type.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          Equipment List
        </h2>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <select
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
          <input
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Search name/type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {(user.role === "Manager" || user.role === "Supervisor") && (
            <button
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition shadow cursor-pointer"
              onClick={() => setShowModal(true)}
              type="button"
            >
              + Add Equipment
            </button>
          )}
        </div>
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <EquipmentForm
            token={token}
            onSuccess={() => {
              setShowModal(false);
              fetchEquipment();
            }}
          />
        </Modal>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="overflow-x-auto rounded-lg shadow mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="py-2 px-4 text-left font-semibold">Name</th>
                <th className="py-2 px-4 text-left font-semibold">Type</th>
                <th className="py-2 px-4 text-left font-semibold">Status</th>
                <th className="py-2 px-4 text-left font-semibold">
                  Last Maint.
                </th>
                <th className="py-2 px-4 text-left font-semibold">
                  Next Maint.
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((eq) => (
                <tr
                  key={eq._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="py-2 px-4">{eq.name}</td>
                  <td className="py-2 px-4">{eq.type}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold 
                      ${
                        eq.status === "Operational"
                          ? "bg-green-100 text-green-700"
                          : eq.status === "Under Maintenance"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {eq.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {eq.lastMaintenance
                      ? new Date(eq.lastMaintenance).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-2 px-4">
                    {eq.nextMaintenance
                      ? new Date(eq.nextMaintenance).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EquipmentList;
