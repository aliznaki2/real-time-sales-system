'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { productAPI } from '../../utils/api';

export default function ProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name:'', price:'', stock:'' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productAPI.getAll();
      const productsData = response.data?.data || response.data || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
      setError('');
    } catch {
      setError('Impossible de charger les produits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name || !formData.price || !formData.stock) {
      setFormError('Tous les champs sont obligatoires');
      return;
    }

    const price = parseFloat(formData.price);
    const stock = parseInt(formData.stock);
    if (price <= 0) { setFormError('Le prix doit être > 0'); return; }
    if (stock < 0) { setFormError('Stock invalide'); return; }

    try {
      await productAPI.create({ name: formData.name, price, stock });
      setFormData({ name:'', price:'', stock:'' });
      setFormSuccess('Produit créé ✅');
      setShowForm(false);
      fetchProducts();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch {
      setFormError('Erreur création produit');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await productAPI.delete(id);
      setFormSuccess('Produit supprimé ✅');
      fetchProducts();
      setTimeout(() => setFormSuccess(''), 3000);
    } catch {
      setFormError('Erreur suppression');
    }
  };

  if (loading || isLoading) return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:'64px', height:'64px', border:'4px solid #3b82f6', borderTop:'4px solid transparent', borderRadius:'50%', animation:'spin 1s linear infinite', margin:'0 auto'}}></div>
        <p>Chargement des produits...</p>
      </div>
      <style>{`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
    </div>
  );

  if (!user) return null;

  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding:'20px', fontFamily:'Arial, sans-serif'}}>
      
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <div>
          <h1 style={{fontSize:'28px', fontWeight:'bold'}}>Catalogue des Produits</h1>
          <p>{products.length} produit(s) disponible(s)</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} style={{backgroundColor:'#2563eb', color:'white', padding:'10px 20px', borderRadius:'8px', cursor:'pointer'}}>
            {showForm ? '❌ Annuler' : '➕ Nouveau Produit'}
          </button>
        )}
      </div>

      {formSuccess && <div style={{backgroundColor:'#d1fae5', padding:'10px', borderRadius:'8px', marginBottom:'10px', color:'#065f46'}}>{formSuccess}</div>}
      {error && <div style={{backgroundColor:'#fee2e2', padding:'10px', borderRadius:'8px', marginBottom:'10px', color:'#b91c1c'}}>{error}</div>}

      {isAdmin && showForm && (
        <form onSubmit={handleCreateProduct} style={{backgroundColor:'#f3f4f6', padding:'20px', borderRadius:'12px', marginBottom:'20px'}}>
          {formError && <div style={{backgroundColor:'#fee2e2', padding:'10px', borderRadius:'8px', marginBottom:'10px', color:'#b91c1c'}}>{formError}</div>}
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nom Produit" style={{width:'100%', padding:'8px', marginBottom:'10px', borderRadius:'6px', border:'1px solid #ccc'}} />
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Prix" step="0.01" min="0" style={{width:'100%', padding:'8px', marginBottom:'10px', borderRadius:'6px', border:'1px solid #ccc'}} />
          <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Stock" min="0" style={{width:'100%', padding:'8px', marginBottom:'10px', borderRadius:'6px', border:'1px solid #ccc'}} />
          <button type="submit" style={{width:'100%', padding:'10px', backgroundColor:'#16a34a', color:'white', borderRadius:'8px', cursor:'pointer'}}>Créer Produit</button>
        </form>
      )}

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'20px'}}>
        {products.map(p => (
          <div key={p._id} style={{backgroundColor:'white', padding:'15px', borderRadius:'12px', boxShadow:'0 2px 6px rgba(0,0,0,0.1)'}}>
            <h3 style={{fontWeight:'bold', fontSize:'18px'}}>{p.name}</h3>
            <p style={{color:'#2563eb', fontWeight:'bold', fontSize:'16px'}}>${p.price.toFixed(2)}</p>
            <p>Stock: {p.stock}</p>
            {isAdmin ? (
              <div style={{display:'flex', gap:'5px'}}>
                <button onClick={() => handleDeleteProduct(p._id)} style={{flex:1, backgroundColor:'#dc2626', color:'white', padding:'8px', borderRadius:'6px'}}>Supprimer</button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
