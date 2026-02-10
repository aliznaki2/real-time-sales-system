'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message);
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
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
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Welcome Back
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '20px' }}>Login to your account</p>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '20px', color: '#4b5563' }}>
          Don't have an account?{' '}
          <span
            onClick={() => router.push('/register')}
            style={{ color: '#3b82f6', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
