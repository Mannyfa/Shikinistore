import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase'; 
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { API_BASE_URL } from '../config/api';

// --- SIZE GENERATION LOGIC ---
const getSizesForCategory = (category) => {
  if (!category) return [];
  if (category === 'Shirts') return ['S', 'M', 'L', 'XL'];
  if (category === 'Trousers') return ['28', '29', '30', '31', '32', '33', '34', '35'];
  if (['Sneakers', 'Sandals', 'Slippers'].includes(category)) {
    return Array.from({length: 19}, (_, i) => String(27 + i));
  }
  return []; 
};

export default function AdminDashboard() {
  const { products, loading: productsLoading } = useProducts();
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null); 
  
  const emptyForm = { name: '', designer: '', category: '', price: '', stock: '', imageUrl: '', description: '', sizes: [] };
  const [formData, setFormData] = useState(emptyForm);

  // Vault Analytics
  const totalItems = products.length;
  const vaultValue = products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0);
  const outOfStock = products.filter(p => p.stock === 0).length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({ ...formData, category: value, sizes: [] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) 
        ? prev.sizes.filter(s => s !== size) 
        : [...prev.sizes, size]
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const openNewModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      designer: product.designer || '',
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      description: product.description || '',
      sizes: product.sizes || []
    });
    setEditingId(product.id);
    setImageFile(null); 
    setIsModalOpen(true);
  };

  const handleSubmitPiece = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);
        uploadData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        uploadData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        const cloudinaryRes = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: uploadData }
        );

        if (!cloudinaryRes.ok) throw new Error('Failed to upload image to Cloudinary');

        const cloudData = await cloudinaryRes.json();
        finalImageUrl = cloudData.secure_url; 
      }

      const url = editingId ? `${API_BASE_URL}/products/${editingId}` : `${API_BASE_URL}/products`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl, 
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });

      if (!response.ok) throw new Error('Failed to update archives');

      setIsModalOpen(false);
      window.location.reload(); 
    } catch (error) {
      console.error('Error saving piece:', error);
      alert('Failed to save to the vault. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the archives?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
      window.location.reload(); 
    } catch (error) {
      console.error('Error deleting piece:', error);
      alert('Failed to delete item from the vault.');
    }
  };

  const availableSizesForCategory = getSizesForCategory(formData.category);

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
  const modalOverlay = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
  const modalContent = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

  return (
    <div className="min-h-screen flex bg-luxury-white relative">
      <div className="w-64 bg-zinc-950 text-white flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div className="p-8">
          <div className="mb-16">
            <h1 className="text-2xl font-editorial tracking-widest">SHIKINI</h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mt-2">Admin Terminal</p>
          </div>
          <nav className="space-y-6">
            {['inventory', 'orders'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`block w-full text-left text-xs uppercase tracking-widest transition-colors ${activeTab === tab ? 'text-luxury-gold' : 'text-zinc-400 hover:text-white'}`}>
                {activeTab === tab && <span className="mr-2">―</span>} {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-8 border-t border-zinc-900">
          <p className="text-xs text-zinc-500 mb-4">admin@shikini.com</p>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors">Terminate Session</button>
        </div>
      </div>

      <div className="flex-1 p-8 md:p-12 lg:p-16 w-full max-w-7xl overflow-y-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-editorial text-luxury-black mb-2">
              {activeTab === 'inventory' ? 'Inventory Management' : 'Order Control'}
            </h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500">
              {activeTab === 'inventory' ? 'Curate and oversee the archives.' : 'Manage client acquisitions and fulfillment.'}
            </p>
          </div>
          {activeTab === 'inventory' && (
            <button onClick={openNewModal} className="bg-luxury-black text-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors">
              + Add New Piece
            </button>
          )}
        </motion.div>

        {activeTab === 'inventory' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="border border-zinc-200 p-6 bg-white">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">Total Vault Value</p>
              <p className="text-3xl font-editorial text-luxury-black">₦{vaultValue.toLocaleString()}</p>
            </div>
            <div className="border border-zinc-200 p-6 bg-white">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">Active Pieces</p>
              <p className="text-3xl font-editorial text-luxury-black">{totalItems}</p>
            </div>
            <div className="border border-zinc-200 p-6 bg-white">
              <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-2">Out of Stock</p>
              <p className="text-3xl font-editorial text-red-500">{outOfStock}</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white border border-zinc-200 overflow-x-auto">
            {productsLoading ? (
              <div className="p-12 text-center text-zinc-400 text-xs uppercase tracking-widest">Syncing with Vault...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Item</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal hidden md:table-cell">Category & Size</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Price</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Stock</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-medium text-luxury-black">{item.name}</p>
                        <p className="text-xs text-zinc-500 font-serif italic">{item.designer}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-xs text-zinc-600 mb-1">{item.category}</p>
                        {item.sizes && item.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.sizes.map(s => (
                              <span key={s} className="text-[9px] bg-zinc-100 text-zinc-500 px-1 border border-zinc-200">{s}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-sm text-luxury-black font-medium">₦{item.price.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${item.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.stock > 0 ? `${item.stock} Available` : 'Archived'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-4">
                        <button onClick={() => openEditModal(item)} className="text-xs uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors">Edit</button>
                        <button onClick={() => handleDelete(item.id, item.name)} className="text-xs uppercase tracking-widest text-red-300 hover:text-red-500 transition-colors">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white border border-zinc-200 overflow-x-auto">
            {ordersLoading ? (
              <div className="p-12 text-center text-zinc-400 text-xs uppercase tracking-widest">Syncing Orders...</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Order ID</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Client</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Date</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal">Total Amount</th>
                    <th className="p-4 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-normal text-right">Status Control</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="p-4 font-mono text-xs text-luxury-black">{order.id.slice(0,8)}</td>
                      <td className="p-4">
                        <p className="text-sm font-medium text-luxury-black">{order.firstName} {order.lastName}</p>
                        <p className="text-[10px] text-zinc-500">{order.email}</p>
                      </td>
                      <td className="p-4 text-xs text-zinc-600">
                        {new Date(order.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="p-4 text-sm text-luxury-black font-medium">₦{order.total.toLocaleString()}</td>
                      <td className="p-4 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs uppercase tracking-widest px-3 py-2 border border-zinc-200 focus:outline-none focus:border-luxury-black cursor-pointer transition-colors ${
                            order.status === 'Pending Transfer' ? 'bg-orange-50 text-orange-700' :
                            order.status === 'Payment Received' ? 'bg-blue-50 text-blue-700' :
                            'bg-green-50 text-green-700'
                          }`}
                        >
                          <option value="Pending Transfer">Pending Transfer</option>
                          <option value="Payment Received">Payment Received</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </div>

      {/* --- RESTRUCTURED MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            
            {/* Dark Overlay Background */}
            <motion.div 
              variants={modalOverlay} initial="hidden" animate="visible" exit="exit" 
              onClick={() => setIsModalOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            
            {/* Modal Card - Set to Flex Column so the inside can scroll */}
            <motion.div 
              variants={modalContent} initial="hidden" animate="visible" exit="exit" 
              className="relative w-full max-w-2xl bg-luxury-white shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Header - Pinned to the top */}
              <div className="flex justify-between items-center p-6 md:p-8 border-b border-zinc-200 flex-shrink-0">
                <h3 className="text-2xl font-editorial text-luxury-black">
                  {editingId ? 'Edit Archived Piece' : 'Archive New Piece'}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-luxury-black transition-colors">
                  Close [X]
                </button>
              </div>

              {/* Modal Body - Scrollable Form Area */}
              <div className="p-6 md:p-8 overflow-y-auto">
                <form onSubmit={handleSubmitPiece} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative group">
                      <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder=" " className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Piece Name</label>
                    </div>
                    <div className="relative group">
                      <input type="text" name="designer" value={formData.designer} onChange={handleInputChange} placeholder=" " className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Designer / Brand</label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative group">
                      <select 
                        name="category" 
                        required 
                        value={formData.category} 
                        onChange={handleInputChange} 
                        className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select Category</option>
                        <option value="Shirts">Shirts</option>
                        <option value="Trousers">Trousers</option>
                        <option value="Sneakers">Sneakers</option>
                        <option value="Sandals">Sandals</option>
                        <option value="Slippers">Slippers</option>
                        <option value="Eye Wear">Eye Wear</option>
                        <option value="Wrist Watches">Wrist Watches</option>
                        <option value="Purses">Purses</option>
                        <option value="Bags">Bags</option>
                      </select>
                      <label className="absolute left-0 -top-4 text-[10px] uppercase tracking-widest text-luxury-black pointer-events-none transition-all">Category</label>
                      <div className="absolute right-0 top-3 pointer-events-none text-zinc-400 text-xs">▼</div>
                    </div>

                    <div className="relative group">
                      <input type="number" name="price" required min="0" value={formData.price} onChange={handleInputChange} placeholder=" " className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Price (₦)</label>
                    </div>
                    <div className="relative group">
                      <input type="number" name="stock" required min="0" value={formData.stock} onChange={handleInputChange} placeholder=" " className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer" />
                      <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-luxury-black peer-valid:-top-4">Total Stock</label>
                    </div>
                  </div>

                  {availableSizesForCategory.length > 0 && (
                    <div className="mt-6 p-6 bg-zinc-50 border border-zinc-200">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-4">Select Available Sizes for Vault</p>
                      <div className="flex flex-wrap gap-2">
                        {availableSizesForCategory.map(size => (
                          <button
                            type="button"
                            key={size}
                            onClick={() => handleSizeToggle(size)}
                            className={`px-4 py-2 text-xs border transition-colors ${
                              formData.sizes.includes(size) 
                                ? 'bg-luxury-black text-white border-luxury-black' 
                                : 'bg-white text-zinc-500 border-zinc-300 hover:border-luxury-black'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="relative group mt-8">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200" />
                    <label className="absolute left-0 -top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all">Product Image</label>
                    {formData.imageUrl && !imageFile && <p className="text-[10px] text-zinc-500 mt-2">Current image active. Upload a new one to replace it.</p>}
                  </div>

                  <div className="relative group mt-4">
                    <textarea name="description" required rows="3" value={formData.description} onChange={handleInputChange} placeholder=" " className="w-full bg-transparent border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-luxury-black transition-colors peer resize-none"></textarea>
                    <label className="absolute left-0 top-3 text-[10px] uppercase tracking-widest text-zinc-400 pointer-events-none transition-all peer-focus:-top-6 peer-focus:text-luxury-black peer-valid:-top-6">Editorial Description</label>
                  </div>

                  {/* THIS IS THE BUTTON YOU COULDN'T REACH! */}
                  <div className="flex gap-4 pt-6">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-luxury-black text-white py-4 text-xs uppercase tracking-widest hover:bg-luxury-gold transition-colors disabled:bg-zinc-300 flex justify-center items-center">
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (editingId ? 'Save Changes' : 'Commit to Vault')}
                    </button>
                  </div>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}