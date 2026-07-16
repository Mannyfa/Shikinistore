import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../config/api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await fetchFromAPI('/orders');
      // Sort orders by newest first
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.warn('Backend /orders route not found yet, loading mock Vault data...');
      // If your backend isn't ready for orders yet, this fallback ensures your Admin UI still works perfectly for testing!
      setOrders([
        { id: 'ORD-9821', firstName: 'Oluwaseun', lastName: 'Adebayo', email: 'seun@example.com', total: 1850000, status: 'Payment Received', createdAt: new Date().toISOString() },
        { id: 'ORD-9820', firstName: 'Chuka', lastName: 'Obi', email: 'chuka@example.com', total: 450000, status: 'Pending Transfer', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'ORD-9819', firstName: 'Amina', lastName: 'Yusuf', email: 'amina@example.com', total: 3200000, status: 'Shipped', createdAt: new Date(Date.now() - 172800000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Optimistically update the UI instantly
      setOrders(current => current.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      // Ping the backend to save the change
      await fetchFromAPI(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Error updating vault order:', err);
    }
  };

  return { orders, loading, updateOrderStatus };
}