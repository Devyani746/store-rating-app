import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import PasswordChange from '../../components/PasswordChange';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/stores/owner/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!data) return <div style={{ padding: 25 }}>Loading Owner Dashboard...</div>;

  return (
    <div style={{ padding: 25, maxWidth: 1100, margin: '0 auto' }}>
      <h1>{data.store.name}</h1>
      <h3 style={{ margin: '10px 0 20px' }}>
        Average Rating: <span style={{ color: '#eab308' }}>{data.avgRating} ★</span>
      </h3>

      {/* Password Change Section */}
      <PasswordChange />

      <h2 style={{ marginTop: 25, marginBottom: 10 }}>Customer Submissions</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
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