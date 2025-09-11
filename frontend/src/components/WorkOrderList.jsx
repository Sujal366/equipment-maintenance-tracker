import React, { useEffect, useState } from "react";
import axios from "axios";
import WorkOrderForm from "./WorkOrderForm";
import WorkOrderStatusUpdate from "./WorkOrderStatusUpdate";
import Modal from "./Modal";

function WorkOrderList({ token, user }) {
  const [workOrders, setWorkOrders] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchWorkOrders = () => {
    axios
      .get("http://localhost:5001/api/workorders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setWorkOrders(res.data))
      .catch((err) => setError("Failed to load work orders"));
  };

  useEffect(() => {
    fetchWorkOrders();
    // eslint-disable-next-line
  }, [token]);

  const uniqueTechs = Array.from(
    new Set(
      workOrders.map((wo) =>
        wo.assignedTechnician?._id && wo.assignedTechnician.name
          ? `${wo.assignedTechnician._id}|${wo.assignedTechnician.name}`
          : null
      )
    )
  ).filter(Boolean);

  const filtered = workOrders.filter(
    (wo) =>
      (!statusFilter || wo.status === statusFilter) &&
      (!priorityFilter || wo.priority === priorityFilter) &&
      (!techFilter ||
        (wo.assignedTechnician &&
          `${wo.assignedTechnician._id}|${wo.assignedTechnician.name}` ===
            techFilter)) &&
      (!search ||
        wo.title.toLowerCase().includes(search.toLowerCase()) ||
        (wo.equipment?.name || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Work Orders</h2>
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <select
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
          >
            <option value="">All Technicians</option>
            {uniqueTechs.map((t) => {
              const [id, name] = t.split("|");
              return (
                <option key={id} value={t}>
                  {name}
                </option>
              );
            })}
          </select>
          <input
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Search title/equipment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {(user.role === "Manager" || user.role === "Supervisor") && (
            <button
              className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition shadow cursor-pointer"
              onClick={() => setShowModal(true)}
              type="button"
            >
              + Add Work Order
            </button>
          )}
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <WorkOrderForm
            token={token}
            user={user}
            onSuccess={() => {
              setShowModal(false);
              fetchWorkOrders();
            }}
          />
        </Modal>
        <div className="overflow-x-auto rounded-lg shadow mt-4">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="py-2 px-4 text-left font-semibold">Title</th>
                <th className="py-2 px-4 text-left font-semibold">Status</th>
                <th className="py-2 px-4 text-left font-semibold">Priority</th>
                <th className="py-2 px-4 text-left font-semibold">Equipment</th>
                <th className="py-2 px-4 text-left font-semibold">
                  Technician
                </th>
                <th className="py-2 px-4 text-left font-semibold">Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wo) => (
                <tr
                  key={wo._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="py-2 px-4">{wo.title}</td>
                  <td className="py-2 px-4">
                    {user.role === "Technician" &&
                    wo.assignedTechnician &&
                    wo.assignedTechnician._id === user.id ? (
                      <WorkOrderStatusUpdate
                        workOrder={wo}
                        token={token}
                        onStatusChange={fetchWorkOrders}
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold 
                        ${
                          wo.status === "Open"
                            ? "bg-yellow-100 text-yellow-700"
                            : wo.status === "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {wo.status}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold 
                      ${
                        wo.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : wo.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </td>
                  <td className="py-2 px-4">{wo.equipment?.name}</td>
                  <td className="py-2 px-4">
                    {wo.assignedTechnician?.name || "Unassigned"}
                  </td>
                  <td className="py-2 px-4">
                    {wo.dueDate
                      ? new Date(wo.dueDate).toLocaleDateString()
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

export default WorkOrderList;
