import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // 1. Initial State
      items: [],
      isOpen: false, // Tracks if the cart drawer is currently sliding out

      // 2. UI Actions
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // 3. Cart Actions
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          // Prevent adding more than what is available in the vault
          if (existingItem.quantity >= product.stock) {
            alert('You have reached the maximum available stock for this piece.');
            return;
          }
          // Increment quantity and open drawer
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isOpen: true, 
          });
        } else {
          // Prevent adding out of stock items completely
          if (product.stock < 1) {
            alert('This piece is currently archived and unavailable.');
            return;
          }
          // Add brand new item to cart and open drawer
          set({
            items: [...currentItems, { ...product, quantity: 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      updateQuantity: (productId, amount) => {
        const currentItems = get().items;
        const itemToUpdate = currentItems.find((item) => item.id === productId);

        if (!itemToUpdate) return;

        const newQuantity = itemToUpdate.quantity + amount;

        // If quantity drops to 0, completely remove the item
        if (newQuantity <= 0) {
          get().removeItem(productId);
          return;
        }

        // Prevent exceeding Firebase database stock
        if (newQuantity > itemToUpdate.stock) {
           alert('Cannot exceed available vault stock.');
           return;
        }

        set({
          items: currentItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // 4. Computed Analytics
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'shikini-vault-cart', // The secure name used to store this in the browser's local memory
    }
  )
);