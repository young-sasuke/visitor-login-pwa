// src/components/WhatsAppLogs.tsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const WhatsAppLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const { data, error } = await supabase.from("whatsapp_logs").select("*").order("timestamp", { ascending: false });
    if (error) {
      console.error("Error fetching WhatsApp logs:", error);
    } else {
      setLogs(data);
    }
  };

  return (
    <div className="bg-white shadow p-4 rounded mt-6">
      <h2 className="text-xl font-bold mb-4">📲 WhatsApp Logs</h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-3">Visitor ID</th>
            <th className="py-2 px-3">Message Type</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-3">{log.visitor_id}</td>
              <td className="py-2 px-3 capitalize">{log.message_type}</td>
              <td className={`py-2 px-3 ${log.status === 'delivered' ? 'text-green-600' : 'text-red-600'}`}>
                {log.status}
              </td>
              <td className="py-2 px-3">{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WhatsAppLogs;
