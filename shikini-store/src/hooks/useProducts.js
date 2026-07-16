import { useState, useEffect } from 'react';
import { fetchFromAPI } from '../config/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchFromAPI('/products');
      
      // THE FIX: Bulletproof data extraction
      // If the backend sends a direct Array: [ {item1}, {item2} ]
      if (Array.isArray(data)) {
        // Sort by newest first (assuming createdAt exists, otherwise just reverse)
        const sorted = data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setProducts(sorted);
      } 
      // If the backend sends an object: { products: [ {item1}, {item2} ] }
      else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } 
      // Fallback
      else {
        console.warn('Unexpected data format from backend:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
      setProducts([]); // Failsafe to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // We return a refresh function so we can force a UI update after adding a piece
  return { products, loading, error, refreshProducts: fetchProducts };
}