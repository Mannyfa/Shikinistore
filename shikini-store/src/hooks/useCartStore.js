import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  isCartOpen: false,

  // UI Toggles
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // Cart Actions
  addToCart: (item) => set((state) => {
    // Check if item exists to increase quantity, or add new
    const existingItem = state.cart.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        cart: state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
        isCartOpen: true, // Auto-open drawer on add
      };
    }
    return { 
      cart: [...state.cart, { ...item, quantity: 1 }],
      isCartOpen: true, 
    };
  }),

  removeFromCart: (id) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== id)
  })),
}));