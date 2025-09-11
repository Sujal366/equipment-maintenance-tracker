import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function WorkOrderStatusUpdate({ workOrder, token, onStatusChange }) {
  const handleChange = async (e) => {
    const status = e.target.value;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/workorders/${workOrder._id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Status updated!");
      if (onStatusChange) onStatusChange();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <>
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
