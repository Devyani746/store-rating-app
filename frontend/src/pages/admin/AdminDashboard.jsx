import React, { useState, useEffect } from 'react';
import API from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, [search, roleFilter, sortField, sortOrder]);

  const fetchStats = async () => {
    const res = await API.get('/admin/stats');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await API.get(`/admin/users?search=${search}&role=${roleFilter}&sortBy=${sortField}&sortOrder=${sortOrder}`);
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await API.get(`/admin/stores?search=${search}`);
    setStores(res.data);
  };

  const toggleSort = (col) => {
    if (sortField === col) setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    else { setSortField(col); setSortOrder('ASC'); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: 20, margin: '20px 0' }}>
        <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 6, flex: 1 }}>Total Users: <b>{stats.totalUsers}</b></div>
        <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 6, flex: 1 }}>Total Stores: <b>{stats.totalStores}</b></div>
        <div style={{ background: '#f1f5f9', padding: 20, borderRadius: 6, flex: 1 }}>Total Ratings: <b>{stats.totalRatings}</b></div>
      </div>

      <h2>User Directory</h2>
      <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
        <input style={{ padding: 8, flex: 1 }} placeholder="Filter by Name, Email, or Address..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ padding: 8 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Normal User</option>
          <option value="OWNER">Store Owner</option>
        </select>
      </div>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e2e8f0' }}>
            <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>Name ⬍</th>
            <th onClick={() => toggleSort('email')} style={{ cursor: 'pointer' }}>Email ⬍</th>
            <th>Address</th>
            <th>Role</th>
            <th>Owner Store Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
              <td>{u.role === 'OWNER' ? `${u.rating} ★` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}