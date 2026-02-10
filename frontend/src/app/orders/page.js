'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderForm from '../../components/OrderForm';
import { orderAPI } from '../../utils/api';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = isAdmin 
        ? await orderAPI.getAllOrders() 
        : await orderAPI.getMyOrders();
      const ordersData = response.data?.data || response.data?.orders || response.data || [];
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
        {isAdmin ? 'All Orders' : 'My Orders'}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
       
        <div style={{ flex: '1 1 300px', background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <OrderForm onSuccess={fetchOrders} />
        </div>

        
        <div style={{ flex: '2 1 500px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>Orders List</h2>

          {loading ? (
            <p style={{ color: '#666' }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ color: '#999' }}>No orders found</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map((order) => (
                <div key={order._id} style={{ padding: '12px', borderBottom: '1px solid #eee', borderRadius: '4px' }}>
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Total:</strong> ${order.total}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
