import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../config/api';

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Uses the bulletproof API utility to grab the single item from your new backend route
        const data = await fetchFromAPI(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch individual product:", err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}