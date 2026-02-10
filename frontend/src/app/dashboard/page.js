'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';
import { salesAPI } from '../../utils/api';
import StatsCard from '../../components/StatsCard';
import NotificationPopup from '../../components/NotificationPopup';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { notifications, isConnected } = useSocket();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [dailySales, setDailySales] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const router = useRouter();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  // Show popup only for admins when a new notification arrives
  useEffect(() => {
    if (isAdmin && notifications.length > 0) {
      const latestNotification = notifications[0];
      setActivePopup(latestNotification);
    }
  }, [notifications, isAdmin]);

  const fetchStats = async () => {
    try {
      const [todayResponse, dailyResponse] = await Promise.all([
        salesAPI.getTodayStats(),
        salesAPI.getDailySales(),
      ]);
      
      setStats(todayResponse.data.data);
      
      const dailySalesData = dailyResponse.data.data;
      if (dailySalesData && dailySalesData.length > 0) {
        setDailySales(dailySalesData[0]); 
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  if (loading || !user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Notification Popup - Only for Admins */}
      {isAdmin && activePopup && (
        <NotificationPopup 
          notification={activePopup} 
          onClose={handleClosePopup}
        />
      )}

      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '32px' }}>
        Welcome, {user.name}!
      </h1>

      {/* Stats Cards - Only Today Revenue and Today Orders */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        <StatsCard 
          title="Today Revenue" 
          value={'$' + stats.totalRevenue.toFixed(2)} 
          icon="💰" 
          color="green"
        />
        <StatsCard 
          title="Today Orders" 
          value={stats.totalOrders} 
          icon="📦" 
          color="blue"
        />
      </div>

      {/* Latest Daily Sales - Full Width */}
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
          Latest Daily Sales
        </h2>

        {dailySales ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Date</p>
              <p style={{ fontSize: '18px', fontWeight: '600' }}>
                {new Date(dailySales.date).toLocaleDateString()}
              </p>
            </div>

            <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#065f46', marginBottom: '4px' }}>Revenue</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                ${dailySales.totalRevenue.toFixed(2)}
              </p>
            </div>

            <div style={{ background: '#dbeafe', padding: '16px', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#1e40af', marginBottom: '4px' }}>Orders</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                {dailySales.totalOrders}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: '#6b7280' }}>No sales data available yet</p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
              Place an order to see statistics
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
