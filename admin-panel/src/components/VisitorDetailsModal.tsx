import { useState } from "react";
import { supabase } from "../supabaseClient";
import axios from "axios";

const VisitorDetailsModal = ({ visitor, onClose }: any) => {
  const [meetingTime, setMeetingTime] = useState(visitor.meeting_time || "");

  const notifyVisitor = async (mobile: string, status: string, meetingTime: string, name: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/whatsapp/send`, {
        mobile,
        status,
        meetingTime,
        name,
      });
    } catch (error) {
      console.error("Failed to send WhatsApp message:", error);
    }
  };

  const updateVisitorStatus = async (status: string) => {
    if (!meetingTime) {
      alert("Please select a meeting time.");
      return;
    }

    try {
      const isoTime = new Date(meetingTime).toISOString(); // ✅ Format to ISO

      const { error } = await supabase
        .from("visitor")
        .update({
          status,
          meeting_time: isoTime,
        })
        .eq("id", visitor.id);

      if (error) {
        console.error("Error updating visitor status:", error);
        alert("Failed to update visitor status.");
      } else {
        // ✅ Send WhatsApp Notification
        await notifyVisitor(visitor.mobile, status, meetingTime, visitor.name);

        alert(`Visitor marked as ${status}`);
        onClose(); // Close modal
        window.location.reload(); // Refresh dashboard
      }
    } catch (err) {
      console.error("Invalid meeting time format:", err);
      alert("Invalid meeting time format.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Visitor Details</h2>
        <p><strong>Name:</strong> {visitor.name}</p>
        <p><strong>Mobile:</strong> {visitor.mobile}</p>
        <p><strong>Purpose:</strong> {visitor.purpose}</p>
        <p><strong>Status:</strong> {visitor.status}</p>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Meeting Time:</label>
          <input
            type="datetime-local"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="mt-5 flex justify-between">
          <button
            onClick={() => updateVisitorStatus("accepted")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={() => updateVisitorStatus("rescheduled")}
            className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
          >
            Reschedule
          </button>
        </div>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="text-gray-600 hover:underline">Close</button>
        </div>
      </div>
    </div>
  );
};

export default VisitorDetailsModal;
