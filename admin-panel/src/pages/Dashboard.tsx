import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import VisitorDetailsModal from "../components/VisitorDetailsModal";
import WhatsAppLogs from "../components/WhatsAppLogs";

const Dashboard = () => {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [branchFilter, setBranchFilter] = useState("All");
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    const { data, error } = await supabase.from("visitor").select("*");
    if (error) {
      console.error("Error fetching visitors:", error);
    } else {
      setVisitors(data);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const filteredVisitors = branchFilter === "All"
    ? visitors
    : visitors.filter((v) => v.branchId === branchFilter);

  const handleUpdateStatus = async (status: string, meetingTime: string) => {
    if (!selectedVisitor) return;

    const { error } = await supabase
      .from("visitor")
      .update({ status, meetingTime })
      .eq("id", selectedVisitor.id);

    if (error) {
      console.error("Error updating visitor status:", error);
    } else {
      setSelectedVisitor(null);
      fetchVisitors(); // Refresh data

      // ✅ (Next step) — send WhatsApp confirmation from backend
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-purple-700">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </header>

      {/* Branch Filter */}
      <div className="my-4">
        <label className="mr-2 font-medium">Filter by Branch:</label>
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="All">All</option>
          <option value="Branch1">Branch1</option>
          <option value="Branch2">Branch2</option>
          <option value="Branch3">Branch3</option>
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Total Visitors</h2>
          <p className="text-2xl text-blue-600">{filteredVisitors.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Accepted</h2>
          <p className="text-2xl text-green-600">
            {filteredVisitors.filter((v) => v.status === "accepted").length}
          </p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-lg font-semibold">Rescheduled</h2>
          <p className="text-2xl text-yellow-600">
            {filteredVisitors.filter((v) => v.status === "rescheduled").length}
          </p>
        </div>
      </div>

      {/* Visitor List */}
      <div className="bg-white shadow p-4 rounded overflow-x-auto">
        <h3 className="text-xl font-bold mb-2">Visitor List</h3>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Mobile</th>
              <th className="py-2 px-4">Purpose</th>
              <th className="py-2 px-4">Branch</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Meeting Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisitors.map((v, idx) => (
              <tr
                key={idx}
                className="border-t cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedVisitor(v)}
              >
                <td className="py-2 px-4">{v.name}</td>
                <td className="py-2 px-4">{v.mobile}</td>
                <td className="py-2 px-4">{v.purpose}</td>
                <td className="py-2 px-4">{v.branchId}</td>
                <td className="py-2 px-4 capitalize">{v.status}</td>
                <td className="py-2 px-4">{v.meetingTime || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visitor Details Modal */}
      {selectedVisitor && (
  <VisitorDetailsModal
    visitor={selectedVisitor}
    onClose={() => setSelectedVisitor(null)}
  />
)}


      {/* WhatsApp Logs Panel */}
      <WhatsAppLogs />
    </div>
  );
};

export default Dashboard;
