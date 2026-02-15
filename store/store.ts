import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";  

//  configureStore: ქმნის მთავარ საცავს (Store), სადაც ინახება მთლიანი აპლიკაციის State
export const store = configureStore({
  //  reducer: აქ ვაერთიანებთ სხვადასხვა "სლაისებს" (Slices)
  reducer: {
    // კალათის ლოგიკა ხელმისაწვდომი იქნება სახელით: state.cart
    cart: cartReducer,
    
    // ფავორიტების ლოგიკა ხელმისაწვდომი იქნება სახელით: state.wishlist
    wishlist: wishlistReducer,  
  },
});