import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function TabsLayout() {
  // Redux-დან ამოგვაქვს კალათაში და ფავორიტებში არსებული ნივთები
  const cartItems = useSelector((state: any) => state.cart.items);
  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  
  // ვითვლით რაოდენობებს Badge-სთვის
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: 'gray',
      headerShown: true,
      tabBarStyle: { 
        height: 85,
        paddingBottom: 80,
        paddingTop: 10,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
      }
    }}>
      
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> 
        }} 
      />

      <Tabs.Screen 
        name="favorites" 
        options={{ 
          title: "Wishlist", 
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
          // tabBarBadge ფავორიტებისთვის
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined 
        }} 
      />

      <Tabs.Screen 
        name="cart" 
        options={{ 
          title: "Cart", 
          tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} />,
          tabBarBadge: cartCount > 0 ? cartCount : undefined 
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> 
        }} 
      />
    </Tabs>
  );
}