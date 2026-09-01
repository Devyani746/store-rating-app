import React, { useState } from 'react';
import API from '../services/api';

export default function PasswordChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleChange = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    try {
      const res = await API.put('/auth/change-password', { currentPassword, newPassword });
      setMsg(res.data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setErr(error.response?.data?.errors?.join(', ') || error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #cbd5e1', marginBottom: 25 }}>
      <h3 style={{ marginBottom: 10, color: '#1e293b' }}>Update Password</h3>
      {msg && <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: 8 }}>{msg}</p>}
      {err && <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: 8 }}>{err}</p>}
      <form onSubmit={handleChange} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          required
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 4, flex: 1, minWidth: 200 }}
        />
        <input
          type="password"
          placeholder="New Password (8-16 chars, 1 uppercase, 1 special)"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: 4, flex: 1, minWidth: 200 }}
        />
        <button
          type="submit"
          style={{ padding: '8px 18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}
        >
          Change Password
        </button>
      </form>
    </div>
  );
}