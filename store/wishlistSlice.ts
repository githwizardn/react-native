import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//  Wishlist-ის ნივთის სტრუქტურა
interface WishlistItem {
  id: string;
  [key: string]: any; // სხვა მონაცემები (სათაური, ფასი, სურათი)
}

// საწყისი მდგომარეობა: ცარიელი მასივი
interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    //  toggleWishlist: ყველაზე ეფექტური მიდგომა. 
    // თუ ნივთი უკვე არის სიაში - შლის, თუ არ არის - ამატებს.
    toggleWishlist: (state, action) => {
      const exists = state.items.find(i => i.id === action.payload.id);
      
      if (exists) {
        // თუ უკვე არსებობს, ვფილტრავთ (ამოვიღებთ) მასივიდან
        state.items = state.items.filter(i => i.id !== action.payload.id);
      } else {
        // თუ არ არსებობს, ვამატებთ ახალ ნივთს
        state.items.push(action.payload);
      }
    }
  }
});

// ექსპორტი კომპონენტებისთვის
export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;