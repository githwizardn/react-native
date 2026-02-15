import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * CartItem Interface
 * Defines the structure for items in the cart.
 */
interface CartItem {
  id: number; 
  quantity: number;
  [key: string]: any; // Allows for dynamic properties like title, price, image, etc.
}

/**
 * CartState Interface
 * items: Active products currently in the cart.
 * deletedItems: Acts as a "Trash" buffer to allow for "Undo" functionality.
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
     * addToCart: Adds a new item or increments an existing one.
     * Logic: If the item exists, it checks if the quantity is under 10 before incrementing.
     */
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        // Enforce MAX limit: Only increment if the current quantity is less than 10
        if (existing.quantity < 10) {
          existing.quantity++;
        }
      } else {
        // New items start with a quantity of 1
        state.items.push({ ...action.payload, quantity: 1 } as CartItem);
      }
    },

    /**
     * updateQuantity: Handles manual + / - button clicks.
     * Logic: Calculates the target quantity first and only updates if it stays 
     * within the safe range of 1 to 10.
     */
    updateQuantity: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const { id, amount } = action.payload;
      const item = state.items.find((i) => i.id === id);
      
      if (item) {
        const newQuantity = item.quantity + amount;
        
        // Enforce strict range: Minimum 1 and Maximum 10
        // This prevents the UI from going to 0 or exceeding 10
        if (newQuantity >= 1 && newQuantity <= 10) {
          item.quantity = newQuantity;
        }
      }
    },

    /**
     * moveToTrash: Removes an item from the active cart and stores it in deletedItems.
     * This is useful for showing an "Undo" snackbar after a deletion.
     */
    moveToTrash: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        state.deletedItems.push(item);
        state.items = state.items.filter((i) => i.id !== action.payload);
      }
    },

    /**
     * restoreFromTrash: The "Undo" action.
     * Moves an item from the trash back into the active items array.
     */
    restoreFromTrash: (state, action: PayloadAction<number>) => {
      const item = state.deletedItems.find((i) => i.id === action.payload);
      if (item) {
        state.items.push(item);
        state.deletedItems = state.deletedItems.filter((i) => i.id !== action.payload);
      }
    },

    /**
     * emptyTrash: Permanently deletes items in the trash buffer.
     */
    emptyTrash: (state) => { 
      state.deletedItems = []; 
    },

    /**
     * clearCart: Resets both active items and the trash.
     * Usually called after a successful checkout.
     */
    clearCart: (state) => {
      state.items = [];
      state.deletedItems = [];
    }
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  moveToTrash, 
  restoreFromTrash, 
  emptyTrash,
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;