'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) router.push('/dashboard');
      else setError(result.message || 'Registration failed');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div
  style={{
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', 
    fontFamily: 'Arial, sans-serif',
  }}
>

      <div
        style={{
          background: 'white',
          padding: '40px',
          borderRadius: '25px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '25px', fontSize: '28px', color: '#1f2937' }}>
          Create Your Account
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#b91c1c',
              padding: '10px',
              borderRadius: '10px',
              marginBottom: '15px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '15px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '15px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '15px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              marginBottom: '15px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#6366f1',
              color: 'white',
              fontSize: '18px',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: '15px', color: '#4b5563' }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
