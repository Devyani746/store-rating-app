import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      loginUser(res.data.token, res.data.user);
      if (res.data.user.role === 'ADMIN') navigate('/admin');
      else if (res.data.user.role === 'OWNER') navigate('/owner');
      else navigate('/user');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '60px auto', padding: 25, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Sign In</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <input style={{ width: '100%', padding: 10, margin: '8px 0' }} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input style={{ width: '100%', padding: 10, margin: '8px 0' }} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
      </form>
      <p style={{ marginTop: 15 }}>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
