import React, { useEffect, useState } from "react";

function IoCList() {
  const [iocs, setIocs] = useState([]);
  const [formData, setFormData] = useState({
    value: "",
    type: "ip",
    description: ""
  });

  // Fetch IoCs from backend
  const fetchIocs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/iocs");
      const data = await res.json();
      setIocs(data);
    } catch (err) {
      console.error("Error fetching IoCs:", err);
    }
  };

  // Submit new IoC
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/iocs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setIocs([...iocs, data]);
      setFormData({ value: "", type: "ip", description: "" });
    } catch (err) {
      console.error("Error adding IoC:", err);
    }
  };

  useEffect(() => {
    fetchIocs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Indicators of Compromise (IoCs)</h2>

      {/* Add IoC Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-x-2">
        <input
          type="text"
          placeholder="Enter IoC value (e.g., 8.8.8.8)"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="ip">IP</option>
          <option value="domain">Domain</option>
          <option value="url">URL</option>
          <option value="hash">File Hash</option>
        </select>
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add IoC
        </button>
      </form>

      {/* IoC Table */}
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Value</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">VirusTotal Reputation</th>
            <th className="border px-4 py-2">Detections</th>
          </tr>
        </thead>
        <tbody>
          {iocs.map((ioc) => (
            <tr key={ioc._id}>
              <td className="border px-4 py-2">{ioc.value}</td>
              <td className="border px-4 py-2">{ioc.type}</td>
              <td className="border px-4 py-2">{ioc.description}</td>
              <td className="border px-4 py-2">
                {ioc.enrichedData?.attributes?.reputation ?? "N/A"}
              </td>
              <td className="border px-4 py-2">
                {ioc.enrichedData?.attributes?.last_analysis_stats
                  ? `Malicious: ${ioc.enrichedData.attributes.last_analysis_stats.malicious}, Harmless: ${ioc.enrichedData.attributes.last_analysis_stats.harmless}`
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IoCList;
