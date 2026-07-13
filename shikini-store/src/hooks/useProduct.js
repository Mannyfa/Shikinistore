import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../config/api';

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSingleProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        // Calls GET http://localhost:5000/api/products/:id
        const response = await fetchFromAPI(`/products/${id}`);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        console.error('Error loading product details:', err);
        setError(err.message || 'Failed to retrieve this item from the vault.');
      } finally {
        setLoading(false);
      }
    };

    getSingleProduct();
  }, [id]);

  return { product, loading, error };
};