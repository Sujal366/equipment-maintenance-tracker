import React, { useState } from "react";
import axios from "axios";
import Toast from "./Toast";

function EquipmentForm({ token, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    status: "Operational",
    lastMaintenance: "",
    nextMaintenance: "",
  });
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ message: "", type: "success" });
    try {
      await axios.post("http://localhost:5001/api/equipment", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: "Equipment added successfully!", type: "success" });
      setForm({
        name: "",
        type: "",
        status: "Operational",
        lastMaintenance: "",
        nextMaintenance: "",
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to add equipment",
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
        <h2 className="text-lg font-bold">Add Equipment</h2>
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            id="name"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="type" className="block mb-1 font-medium">
            Type
          </label>
          <input
            id="type"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="type"
            placeholder="Type"
            value={form.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="status" className="block mb-1 font-medium">
            Status
          </label>
          <select
            id="status"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Operational">Operational</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>
        <div>
          <label htmlFor="lastMaintenance" className="block mb-1 font-medium">
            Last Maintenance
          </label>
          <input
            id="lastMaintenance"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="lastMaintenance"
            type="date"
            value={form.lastMaintenance}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="nextMaintenance" className="block mb-1 font-medium">
            Next Maintenance
          </label>
          <input
            id="nextMaintenance"
            className="input input-bordered w-full border border-gray-300 rounded px-1"
            name="nextMaintenance"
            type="date"
            value={form.nextMaintenance}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full border border-gray-300 rounded px-1 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition cursor-pointer"
          type="submit"
        >
          Add Equipment
        </button>
      </form>
    </>
  );
}

export default EquipmentForm;
