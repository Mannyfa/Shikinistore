import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../config/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]); // Notice plural 'products' and empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        // Calls GET http://localhost:5000/api/products
        const response = await fetchFromAPI('/products');
        setProducts(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error loading products from backend:', err);
        setError(err.message || 'Failed to connect to the luxury archives.');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return { products, loading, error };
};