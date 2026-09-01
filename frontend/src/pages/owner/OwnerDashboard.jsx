import React, { useState, useEffect } from 'react';
import API from '../../services/api';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/stores/owner/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ padding: 20 }}>Loading Owner Dashboard...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.store.name}</h1>
      <h3>Average Rating: <span style={{ color: '#eab308' }}>{data.avgRating} ★</span></h3>

      <h2 style={{ marginTop: 25 }}>Customer Submissions</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Rating</th>
            <th>Date Submitted</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating} ★</td>
              <td>{new Date(r.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}