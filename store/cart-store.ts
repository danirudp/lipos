import { create } from 'zustand';

// Define the shape of a Cart Item
export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

// Define the Store Actions
interface CartStore {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      // If item exists, just increase quantity
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      // If new item, add it to array
      return {
        items: [...state.items, { ...product, quantity: 1 }],
      };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
