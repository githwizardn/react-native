import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * 1. CartItem ინტერფეისი
 */
interface CartItem {
  id: number; 
  quantity: number;
  [key: string]: any; 
}

/**
 * 2. საწყისი მდგომარეობა (Initial State)
 */
interface CartState {
  items: CartItem[];
  deletedItems: CartItem[];
}

const initialState: CartState = { items: [], deletedItems: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * 3. addToCart: ამატებს ნივთს კალათაში.
     */
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        if (existing.quantity < 10) existing.quantity++;
      } else {
        state.items.push({ id: action.payload.id, quantity: 1, ...action.payload });
      }
    },

    /**
     * 4. updateQuantity: რაოდენობის შეცვლა (+1 ან -1).
     */
    updateQuantity: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const { id, amount } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item && item.quantity + amount >= 1) {
        item.quantity += amount;
      }
    },

    /**
     * 5. moveToTrash: ნივთის გადატანა კალათიდან ურნაში.
     */
    moveToTrash: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        state.deletedItems.push(item);
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    /**
     * 6. restoreFromTrash: "Undo" ფუნქცია.
     */
    restoreFromTrash: (state, action: PayloadAction<number>) => {
      const item = state.deletedItems.find((i) => i.id === action.payload);
      if (item) {
        state.items.push(item);
        state.deletedItems = state.deletedItems.filter((i) => i.id !== action.payload);
      }
    },

    /**
     * 7. emptyTrash: მხოლოდ ურნის (წაშლილი ნივთების) გასუფთავება.
     */
    emptyTrash: (state) => { 
      state.deletedItems = []; 
    },

    /**
     * 8. clearCart: კალათის სრული დაცლა.
     * გამოიყენება Checkout-ის წარმატებით დასრულების შემდეგ.
     * შლის როგორც აქტიურ ნივთებს, ისე ურნას.
     */
    clearCart: (state) => {
      state.items = [];
      state.deletedItems = [];
    }
  },
});

// ექსპორტში დავამატეთ clearCart
export const { 
  addToCart, 
  updateQuantity, 
  moveToTrash, 
  restoreFromTrash, 
  emptyTrash,
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;