import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { io } from 'socket.io-client';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [socketAlert, setSocketAlert] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };
    fetchSummary();

    // Realtime socket
    const socket = io('http://localhost:5000');
    socket.on('connect', () => console.log('socket connected'));
    socket.on('newAlert', (alert) => {
      setSocketAlert(alert);
      // optionally refetch summary / alerts
    });

    return () => socket.disconnect();
  }, [token]);

  const downloadFile = async (type) => {
    const url = `http://localhost:5000/api/reports/export/${type}`;
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: type === 'csv' ? 'text/csv' : 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = type === 'csv' ? 'risk_report.csv' : 'summary_report.pdf';
      link.click();
    } catch (err) {
      console.error('Download error', err);
    }
  };

  if (!summary) return <p>Loading Dashboard...</p>;

  const pieData = [
    { name: 'Logs', value: summary.logs },
    { name: 'IOCs', value: summary.iocs },
    { name: 'Risks', value: summary.risks },
    { name: 'Alerts', value: summary.alerts }
  ];

  const barData = [
    { name: 'Logs', count: summary.logs },
    { name: 'IOCs', count: summary.iocs },
    { name: 'Risks', count: summary.risks },
    { name: 'Alerts', count: summary.alerts }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1>📊 Cyber Intelligence Dashboard</h1>

      {socketAlert && (
        <div style={{ background: '#ffe6e6', padding: 10, margin: '10px 0', borderRadius: 6 }}>
          <strong>New Alert:</strong> {socketAlert.message} — <em>{socketAlert.severity}</em>
        </div>
      )}

      <div style={{ margin: '20px 0' }}>
        <button onClick={() => downloadFile('csv')}>⬇️ Export CSV</button>
        <button onClick={() => downloadFile('pdf')} style={{ marginLeft: 10 }}>⬇️ Export PDF</button>
      </div>

      <div style={{ display: 'flex', gap: 50 }}>
        <PieChart width={350} height={300}>
          <Pie data={pieData} dataKey="value" cx={175} cy={150} outerRadius={100} label>
            {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>

        <BarChart width={400} height={300} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </div>

      <h2 style={{ marginTop: 30 }}>Recent Alerts</h2>
      <table border="1" cellPadding="8" style={{ width: '80%', marginTop: 10 }}>
        <thead>
          <tr><th>Message</th><th>Severity</th><th>Ack</th><th>Date</th></tr>
        </thead>
        <tbody>
          {summary.recentAlerts.map(a => (
            <tr key={a._id}>
              <td>{a.message}</td>
              <td>{a.severity}</td>
              <td>{a.acknowledged ? '✅' : '❌'}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
