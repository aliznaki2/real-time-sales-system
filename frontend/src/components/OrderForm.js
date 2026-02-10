'use client';

import { useState, useEffect } from 'react';
import { orderAPI, productAPI } from '../utils/api';

export default function OrderForm({ onSuccess }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ productId: '', quantity: '1' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await orderAPI.create({
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
      });
      setFormData({ productId: '', quantity: '1' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p._id === formData.productId);
  const totalPrice = selectedProduct ? (selectedProduct.price * parseInt(formData.quantity || 0)).toFixed(2) : '0.00';

  return (
    <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Create Order</h2>

      {error && (
        <div style={{ background: '#ffe5e5', border: '1px solid #f5c2c2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Product :</label>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value=''>Choose...</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>
                {p.name} - Stock: {p.stock}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px', display: 'block' }}>Quantity :</label>
          <input
            type='number'
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
            min='1'
            max={selectedProduct?.stock || 999}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          />
        </div>

        {selectedProduct && (
          <div style={{ background: '#ebf8ff', border: '1px solid #bee3f8', padding: '10px', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '500' }}>
              <span>Total:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>${totalPrice}</span>
            </div>
          </div>
        )}

        <button
          type='submit'
          disabled={loading || !formData.productId}
          style={{
            width: '100%',
            background: '#16a34a',
            color: '#fff',
            padding: '10px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
