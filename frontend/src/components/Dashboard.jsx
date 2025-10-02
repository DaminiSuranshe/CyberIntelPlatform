import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from "recharts";

const API = "http://localhost:5000/api";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [timeseries, setTimeseries] = useState([]);
  const [topIoCs, setTopIoCs] = useState([]);
  const token = localStorage.getItem("token"); // assume login saved token

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    axios.get(`${API}/dashboard/stats`, { headers })
      .then(res => { setOverview(res.data); setTopIoCs(res.data.topIoCs || []); })
      .catch(err => console.error(err));
    axios.get(`${API}/dashboard/timeseries?days=30`, { headers })
      .then(res => setTimeseries(res.data))
      .catch(err => console.error(err));
  }, [token]);

  const handleExport = (type, format) => {
    const headers = { Authorization: `Bearer ${token}` , responseType: 'blob' };
    window.open(`${API}/reports/export?type=${type}&format=${format}&_=${Date.now()}`, "_blank");
    // For nicer UX we could fetch blob and force-download, but window.open works for GET
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Netra — Dashboard</h2>

      {overview && (
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <StatCard title="IoCs" value={overview.counts.iocCount} />
          <StatCard title="Logs" value={overview.counts.logCount} />
          <StatCard title="Risks" value={overview.counts.riskCount} />
          <StatCard title="Alerts" value={overview.counts.alertCount} />
        </div>
      )}

      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
        <div style={{ flex: 1, height: 300, background: "#fff", padding: 12, borderRadius: 8 }}>
          <h4>Incidents (last 30 days)</h4>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={timeseries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{fontSize:10}}/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: 420, background: "#fff", padding: 12, borderRadius: 8 }}>
          <h4>Top IoCs</h4>
          <table style={{ width: "100%", fontSize: 13 }}>
            <thead>
              <tr><th>Value</th><th>Count</th></tr>
            </thead>
            <tbody>
              {topIoCs.map((ioc, idx) => (
                <tr key={idx}>
                  <td>{ioc.value}</td>
                  <td>{ioc.count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => handleExport("risks","csv")}>Export Risks CSV</button>
            <button onClick={() => handleExport("risks","pdf")}>Export Risks PDF</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={{
      background: "#fff", padding: 12, borderRadius: 8, minWidth: 150, textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div style={{ fontSize: 12, color: "#666" }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: "bold", marginTop: 6 }}>{value}</div>
    </div>
  );
}
