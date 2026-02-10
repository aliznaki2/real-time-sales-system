'use client';

import { useEffect, useState } from 'react';

export default function NotificationPopup({ notification, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      handleClose();
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '-100px'})`,
        zIndex: 9999,
        minWidth: '400px',
        maxWidth: '600px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        padding: '20px',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-out',
        border: '2px solid #10b981',
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#6b7280',
          lineHeight: '1',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
        onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        ×
      </button>

      {/* Notification content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div
          style={{
            fontSize: '32px',
            flexShrink: 0,
          }}
        >
          🔔
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '8px',
            }}
          >
            New Order Received!
          </h3>

          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
            <strong>Product:</strong> {notification.productName}
          </p>

          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>
            <strong>Quantity:</strong> {notification.quantity}
          </p>

          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#10b981', marginTop: '8px' }}>
            ${notification.totalPrice.toFixed(2)}
          </p>

          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: '#e5e7eb',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: '#10b981',
            animation: 'progress 20s linear',
            transformOrigin: 'left',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
