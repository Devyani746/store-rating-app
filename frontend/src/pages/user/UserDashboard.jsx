import React, { useState, useEffect } from 'react';
import API from '../../services/api';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    loadStores();
  }, [search, sortBy, sortOrder]);

  const loadStores = async () => {
    const res = await API.get(`/stores/user/stores?search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    setStores(res.data);
  };

  const handleRating = async (storeId, rating) => {
    await API.post('/ratings', { storeId, rating });
    loadStores();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Store Directory & Ratings</h1>
      <input
        style={{ padding: 10, width: '100%', marginBottom: 15 }}
        placeholder="Search stores by name or address..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            <th onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'); }} style={{ cursor: 'pointer' }}>Store Name ⬍</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Submit / Modify</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.overallRating} ★</td>
              <td>{s.userRating ? `${s.userRating} ★` : 'Not Rated'}</td>
              <td>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRating(s.id, star)}
                    style={{
                      cursor: 'pointer',
                      marginRight: 4,
                      background: (s.userRating || 0) >= star ? '#eab308' : '#e2e8f0',
                      border: 'none',
                      padding: '4px 8px'
                    }}
                  >
                    ★ {star}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}