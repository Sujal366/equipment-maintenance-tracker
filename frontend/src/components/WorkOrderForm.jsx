import React, { useState, useEffect } from "react";
import axios from "axios";
import Toast from "./Toast";

function WorkOrderForm({ token, user, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    equipment: "",
    priority: "Medium",
    status: "Open",
    assignedTechnician: "",
    description: "",
    dueDate: "",
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/equipment`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEquipmentList(res.data));
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/technicians`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTechnicians(res.data));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: "", type: "success" });
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/workorders`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: "Work order created!", type: "success" });
      setForm({
        title: "",
        equipment: "",
        priority: "Medium",
        status: "Open",
        assignedTechnician: "",
        description: "",
        dueDate: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to create work order",
        type: "error",
      });
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-md bg-white p-4 rounded space-y-4"
      >
        <h2 className="text-lg font-bold">Create Work Order</h2>
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="equipment" className="block mb-1 font-medium">
            Equipment
          </label>
          <select
            id="equipment"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="equipment"
            value={form.equipment}
            onChange={handleChange}
            required
          >
            <option value="">Select Equipment</option>
            {equipmentList.map((eq) => (
              <option key={eq._id} value={eq._id}>
                {eq.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block mb-1 font-medium">
            Priority
          </label>
          <select
            id="priority"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="assignedTechnician"
            className="block mb-1 font-medium"
          >
            Assign Technician
          </label>
          <select
            id="assignedTechnician"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="assignedTechnician"
            value={form.assignedTechnician}
            onChange={handleChange}
            required
          >
            <option value="">Assign Technician</option>
            {technicians.map((tech) => (
              <option key={tech._id} value={tech._id}>
                {tech.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="dueDate" className="block mb-1 font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full border border-gray-300 rounded px-1 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
          type="submit"
        >
          Create Work Order
        </button>
      </form>
    </>
  );
}

export default WorkOrderForm;
