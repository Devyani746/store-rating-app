import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setErrors(err.response?.data?.errors || [err.response?.data?.message || 'Signup failed']);
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: '40px auto', padding: 25, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Normal User Registration</h2>
      {errors.length > 0 && (
        <div style={{ color: 'red', marginBottom: 10 }}>
          {errors.map((msg, i) => <p key={i}>• {msg}</p>)}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>Full Name (20–60 characters)</label>
        <input style={{ width: '100%', padding: 8, margin: '5px 0 12px' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />

        <label>Email Address</label>
        <input style={{ width: '100%', padding: 8, margin: '5px 0 12px' }} type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />

        <label>Password (8–16 chars, 1 uppercase, 1 special char)</label>
        <input style={{ width: '100%', padding: 8, margin: '5px 0 12px' }} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />

        <label>Address (Max 400 characters)</label>
        <textarea style={{ width: '100%', padding: 8, margin: '5px 0 12px' }} rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />

        <button style={{ width: '100%', padding: 10, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ marginTop: 15 }}>Already registered? <Link to="/login">Login</Link></p>
    </div>
  );
}