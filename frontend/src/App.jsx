import React from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function NavigationHeader() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#0f172a', color: '#fff' }}>
      <h3>Store Rating Platform</h3>
      {user && (
        <div>
          <span style={{ marginRight: 15 }}>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavigationHeader />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}