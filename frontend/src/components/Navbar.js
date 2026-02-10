'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav
      style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
          Sales System
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#374151' }}>
                Welcome, {user?.name}{' '}
                {isAdmin && (
                  <span
                    style={{
                      marginLeft: '5px',
                      fontSize: '12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '6px',
                    }}
                  >
                    Admin
                  </span>
                )}
              </span>

              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#374151',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '6px 12px',
                }}
              >
                Dashboard
              </button>

              {isAdmin && (
                <button
                  onClick={() => router.push('/products')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#374151',
                    cursor: 'pointer',
                    fontSize: '14px',
                    padding: '6px 12px',
                  }}
                >
                  Products
                </button>
              )}
              {!isAdmin && (
              <button
                onClick={() => router.push('/orders')}
                style={{
                  padding: '8px 12px',
                  color: '#374151',
                  fontWeight: '500',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#111827';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                Orders
              </button>
            )}


              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#374151',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  fontSize: '14px',
                }}
              >
                Login
              </button>
              <button
                onClick={() => router.push('/register')}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
