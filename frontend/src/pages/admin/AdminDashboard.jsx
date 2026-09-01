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

  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await API.post('/admin/users', userForm);
      setMessage(res.data.message);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'USER' });
      fetchStats();
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || err.response?.data?.message || 'Error creating user');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await API.post('/admin/stores', storeForm);
      setMessage(res.data.message);
      setStoreForm({ name: '', email: '', address: '', ownerId: '' });
      fetchStats();
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating store');
    }
  };

  return (
    <div style={{ padding: 25, maxWidth: 1200, margin: '0 auto' }}>
      <h2>System Administrator Portal</h2>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {/* Stats Counter */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, margin: '20px 0' }}>
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <h4>Total Users</h4>
          <h1 style={{ color: '#2563eb' }}>{stats.totalUsers}</h1>
        </div>
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <h4>Total Stores</h4>
          <h1 style={{ color: '#2563eb' }}>{stats.totalStores}</h1>
        </div>
        <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <h4>Total Submitted Ratings</h4>
          <h1 style={{ color: '#2563eb' }}>{stats.totalRatings}</h1>
        </div>
      </div>

      {/* Creation Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
        {/* Add User */}
        <div style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #cbd5e1' }}>
          <h3>Add New User</h3>
          <form onSubmit={handleCreateUser}>
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Name (20-60 chars)" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Email" type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Password (8-16 chars, 1 uppercase, 1 special)" type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Address (Max 400 chars)" value={userForm.address} onChange={e => setUserForm({ ...userForm, address: e.target.value })} required />
            <select style={{ width: '100%', padding: 8, margin: '6px 0' }} value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin User</option>
              <option value="OWNER">Store Owner</option>
            </select>
            <button style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Create User</button>
          </form>
        </div>

        {/* Add Store */}
        <div style={{ background: '#ffffff', padding: 20, borderRadius: 8, border: '1px solid #cbd5e1' }}>
          <h3>Add New Store</h3>
          <form onSubmit={handleCreateStore}>
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Store Name (20-60 chars)" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} required />
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Store Email" type="email" value={storeForm.email} onChange={e => setStoreForm({ ...storeForm, email: e.target.value })} required />
            <input style={{ width: '100%', padding: 8, margin: '6px 0' }} placeholder="Store Address" value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} required />
            <select style={{ width: '100%', padding: 8, margin: '6px 0' }} value={storeForm.ownerId} onChange={e => setStoreForm({ ...storeForm, ownerId: e.target.value })} required>
              <option value="">Select Store Owner...</option>
              {users.filter(u => u.role === 'OWNER').map(o => (
                <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
              ))}
            </select>
            <button style={{ padding: '8px 16px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Create Store</button>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <h3>User Records</h3>
      <div style={{ display: 'flex', gap: 10, margin: '10px 0' }}>
        <input style={{ padding: 8, flex: 1 }} placeholder="Filter users by Name, Email, Address..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ padding: 8 }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
          <option value="OWNER">Store Owner</option>
        </select>
      </div>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead style={{ background: '#f1f5f9' }}>
          <tr>
            <th onClick={() => { setSortField('name'); setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'); }} style={{ cursor: 'pointer' }}>Name ⬍</th>
            <th onClick={() => { setSortField('email'); setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC'); }} style={{ cursor: 'pointer' }}>Email ⬍</th>
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
              <td>{u.role === 'OWNER' ? `${u.rating || 0} ★` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}