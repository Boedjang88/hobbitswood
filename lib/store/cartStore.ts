import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // Cart item unique ID
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedVariant?: string;
  selectedMaterial?: string;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (open?: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (item) => set((state) => {
        // Check if identical product with same variants already exists
        const existingItem = state.items.find(
          (i) => i.productId === item.productId && 
                 i.selectedVariant === item.selectedVariant && 
                 i.selectedMaterial === item.selectedMaterial
        );

        if (existingItem) {
          return {
            items: state.items.map((i) =>
              i.id === existingItem.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isDrawerOpen: true,
          };
        }

        return {
          items: [...state.items, { ...item, id: crypto.randomUUID() }],
          isDrawerOpen: true,
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),

      clearCart: () => set({ items: [] }),

      toggleDrawer: (open) => set((state) => ({
        isDrawerOpen: open !== undefined ? open : !state.isDrawerOpen,
      })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'woodcraft-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not drawer state
    }
  )
);
