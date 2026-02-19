import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
//  Redux მოქმედებები: საჭიროა კალათის მართვისთვის
import { updateQuantity, clearCart, moveToTrash, restoreFromTrash, emptyTrash, setCart } from '../../store/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 *  TypeScript-ის ინტერფეისი
 * id: number - აუცილებელია, რადგან API-დან ციფრი მოდის.
 */
type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export default function CartPage() {
  //  წვდომა Redux Store-ზე: ვიღებთ აქტიურ და წაშლილ ნივთებს
  const { items, deletedItems } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  
  //  ჯამური ღირებულების გამოთვლა (ფასი გამრავლებული რაოდენობაზე)
  const total = items.reduce((acc: number, i: CartItem) => acc + i.price * i.quantity, 0);

    // როცა გვერდი ჩაიტვირთება, წამოვიღოთ შენახული კალათა
  useEffect(() => {
    const loadCartData = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart_data');
        if (savedCart) {
          dispatch(setCart(JSON.parse(savedCart)));
        }
      } catch (error) {
        console.error("Failed to load cart data", error);
      }
    };
    loadCartData();
  }, [dispatch]);

  //  როცა კალათაში რამე შეიცვლება, მაშინვე შევინახოთ AsyncStorage-ში
  useEffect(() => {
    const saveCartData = async () => {
      try {
        await AsyncStorage.setItem('cart_data', JSON.stringify({ items, deletedItems }));
      } catch (error) {
        console.error("Failed to save cart data", error);
      }
    };
    saveCartData();
  }, [items, deletedItems]);


  /**
   *  Checkout ფუნქცია
   * ამოწმებს არის თუ არა მომხმარებელი ავტორიზებული.
   */
   
  const handleCheckout = async () => {
    try {
      //  ვამოწმებთ ავტორიზაციას
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert(
          "autorization required",
          "you need to be logged in to proceed with checkout. would you like to log in or continue as a guest?",
          [
            { text: "Continue as Guest", onPress: () => console.log("Guest checkout") },
            { text: "Log In", onPress: () => router.push('/login') }
          ]
        );
      } else {
        //  წარმატებული ყიდვის შეტყობინება
        Alert.alert(
          "success", 
          "your order has been placed successfully!",
          [
            { 
              text: "go to home", 
              onPress: () => {
                // კალათის სრული გასუფთავება (Redux)
                dispatch(clearCart()); 
                
                //  მომხმარებლის გადაყვანა მთავარ გვერდზე
                router.replace('/'); 
              } 
            }
          ]
        );
      }
    } catch (error) {
      console.error("Storage error:", error);
      Alert.alert("error", "unexpected error occurred during checkout. please try again.");
    }
  };

  /**
   *  ნაგვის ურნის გასუფთავება (Clear All)
   * აჩვენებს გაფრთხილებას საბოლოო წაშლამდე.
   */
  const handleEmptyTrash = () => {
    Alert.alert(
      "Empty Trash",
      "are you sure you want to permanently delete all items in the trash?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => dispatch(emptyTrash()) 
        }
      ]
    );
  };

  /**
   *  თუ კალათაც და ურნაც ცარიელია
   * ვაჩვენებთ "Empty State"-ს, რომ მომხმარებელს არ დახვდეს ცარიელი თეთრი ეკრანი.
   */
  if (items.length === 0 && deletedItems.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="cart-outline" size={80} color="#cbd5e1" />
        <Text style={styles.emptyText}>your cart is empty</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/')}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>My Cart</Text>
      
      {/*  აქტიური კალათის ნივთების ჩამონათვალი */}
      {items.map((item: CartItem) => (
        <View key={item.id.toString()} style={styles.cartItem}>
          <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
          
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={styles.itemName}>{item.title}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>

          {/* რაოდენობის მართვა (+/-) */}
          <View style={styles.qtyBox}>
            {/* Minus Button: Disabled when quantity is 1 */}
            <TouchableOpacity 
              onPress={() => dispatch(updateQuantity({id: item.id, amount: -1}))}
              disabled={item.quantity <= 1}
              style={{ opacity: item.quantity <= 1 ? 0.3 : 1 }}
            >
              <Ionicons name="remove" size={20} color="black" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            {/* Plus Button: Disabled when quantity is 10 */}
            <TouchableOpacity 
              onPress={() => dispatch(updateQuantity({id: item.id, amount: 1}))}
              disabled={item.quantity >= 10}
              style={{ opacity: item.quantity >= 10 ? 0.3 : 1 }}
            >
              <Ionicons name="add" size={20} color="black" />
            </TouchableOpacity>
          </View>

          {/* ნაგავში გადატანა */}
          <TouchableOpacity onPress={() => dispatch(moveToTrash(item.id))} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      ))}

      {/*  ნაგვის ურნის სექცია (ჩნდება მხოლოდ მაშინ, როცა deletedItems ცარიელი არაა) */}
      {deletedItems.length > 0 && (
        <View style={styles.trashContainer}>
          <View style={styles.trashHeader}>
            <Text style={styles.trashTitle}>Recently Removed</Text>
            {/* Clear All ღილაკი პირდაპირ იძახებს Alert ფუნქციას */}
            <TouchableOpacity onPress={handleEmptyTrash}>
              <Text style={styles.clearTrashText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {deletedItems.map((item: CartItem) => (
            <View key={`trash-${item.id}`} style={styles.trashRow}>
              <Text numberOfLines={1} style={styles.trashLabel}>{item.title}</Text>
              
              {/* Undo ღილაკი - აბრუნებს ნივთს კალათაში */}
              <TouchableOpacity 
                style={styles.undoBtn} 
                onPress={() => dispatch(restoreFromTrash(item.id))}
              >
                <Text style={styles.undoText}>Undo</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/*  ქვედა სექცია (Footer): ჯამი და გადახდა */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>CHECKOUT NOW</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

//  სტილები
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  header: { fontSize: 28, fontWeight: '900', marginBottom: 20, marginTop: 20 },
  cartItem: { 
    flexDirection: 'row', alignItems: 'center', marginBottom: 15, 
    backgroundColor: '#f8fafc', padding: 15, borderRadius: 20 
  },
  img: { width: 60, height: 60, marginRight: 15 },
  itemName: { fontWeight: 'bold', fontSize: 15, color: '#1e293b' },
  itemPrice: { color: '#2563eb', fontWeight: 'bold', marginTop: 3 },
  qtyBox: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', 
    borderRadius: 12, padding: 5, borderWidth: 1, borderColor: '#e2e8f0' 
  },
  qtyText: { fontWeight: 'bold', marginHorizontal: 10 },
  deleteBtn: { marginLeft: 15, padding: 5 },
  trashContainer: { 
    marginTop: 30, padding: 20, backgroundColor: '#fff1f2', 
    borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#fecdd3' 
  },
  trashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  trashTitle: { color: '#e11d48', fontWeight: 'bold', fontSize: 16 },
  clearTrashText: { color: '#be123c', fontWeight: '600', textDecorationLine: 'underline' },
  trashRow: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.5)', padding: 10, borderRadius: 12 
  },
  trashLabel: { flex: 1, fontSize: 13, color: '#475569', marginRight: 10 },
  undoBtn: { backgroundColor: '#10b981', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  undoText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  footer: { marginTop: 30, marginBottom: 50 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, color: '#64748b' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  checkoutBtn: { 
    backgroundColor: '#1e293b', padding: 20, borderRadius: 20, 
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 
  },
  checkoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 20, fontWeight: '600', color: '#64748b', marginVertical: 20 },
  shopBtn: { backgroundColor: '#2563eb', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 15 }
});