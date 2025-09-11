import React, { useState } from "react";
import axios from "axios";
import Toast from "./Toast";

function WorkOrderStatusUpdate({ workOrder, token, onStatusChange }) {
  const [toast, setToast] = useState({ message: "", type: "success" });

  const handleChange = async (e) => {
    const status = e.target.value;
    try {
      await axios.put(
        `http://localhost:5001/api/workorders/${workOrder._id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setToast({ message: "Status updated!", type: "success" });
      if (onStatusChange) onStatusChange();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Failed to update status",
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
      <select
        className="input input-bordered"
        value={workOrder.status}
        onChange={handleChange}
        disabled={workOrder.status === "Completed"}
      >
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </>
  );
}

export default WorkOrderStatusUpdate;
