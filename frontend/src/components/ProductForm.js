'use client';

import { useState } from 'react';
import { productAPI } from '../utils/api';

export default function ProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await productAPI.create({ name: formData.name, price: parseFloat(formData.price), stock: parseInt(formData.stock) });
      setFormData({ name: '', price: '', stock: '' });
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-xl font-bold mb-4'>Create Product</h2>
      {error && <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div><label className='block text-sm font-medium mb-1'>Name</label><input type='text' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className='w-full px-4 py-2 border rounded-lg' /></div>
        <div><label className='block text-sm font-medium mb-1'>Price</label><input type='number' value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required min='0' step='0.01' className='w-full px-4 py-2 border rounded-lg' /></div>
        <div><label className='block text-sm font-medium mb-1'>Stock</label><input type='number' value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required min='0' className='w-full px-4 py-2 border rounded-lg' /></div>
        <button type='submit' disabled={loading} className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'>{loading ? 'Creating...' : 'Create'}</button>
      </form>
    </div>
  );
}
