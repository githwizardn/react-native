import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
//  იმპორტები Redux-ისთვის
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();

  //  Redux-ის ინსტრუმენტების მომზადება
  const dispatch = useDispatch();
  const wishlist = useSelector((state: any) => state.wishlist.items);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(setProduct);
  }, [id]);

  if (!product) return null;

  //  ვამოწმებთ, არის თუ არა უკვე ფავორიტებში (აიქონის შესაცვლელად)
  const isFav = wishlist.some((item: any) => item.id === product.id);

  return (
    <View style={styles.detailContainer}>
      {/* ზედა ნავიგაციის ღილაკები */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navCircle}>
          <Ionicons name="chevron-back" size={24} color="#4e95ff" />
        </TouchableOpacity>
        
        <View style={styles.rightNav}>
                    
          {/*  ფავორიტების ფუნქცია გულზე დაჭერისას */}
          <TouchableOpacity 
            style={styles.navCircle} 
            onPress={() => dispatch(toggleWishlist(product))}
          >
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={24} 
              color={isFav ? "#ef4444" : "#4e95ff"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageSection}>
          <Image source={{ uri: product.image }} style={styles.mainImg} resizeMode="contain" />
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.activeDot]} /><View style={styles.dot} /><View style={styles.dot} />
          </View>
        </View>

        <View style={styles.infoSheet}>
          <Text style={styles.detailPrice}>${product.price}</Text>
          <Text style={styles.detailTitle}>{product.title}</Text>
          
          <Text style={styles.sectionTitle}>Color: <Text style={{fontWeight:'700'}}>Blue/Copper</Text></Text>
          <View style={styles.colorOptions}>
            <View style={[styles.colorCircle, {backgroundColor: '#333'}]} />
            <View style={[styles.colorCircle, {backgroundColor: '#4e95ff', borderWidth: 2, borderColor: '#1e3a8a'}]} />
            <View style={[styles.colorCircle, {backgroundColor: '#9333ea'}]} />
            <View style={[styles.colorCircle, {backgroundColor: '#d97706'}]} />
          </View>

          <Text style={styles.descText}>{product.description}</Text>

          {/*  კალათაში დამატების ფუნქცია Buy Now ღილაკზე */}
          <TouchableOpacity 
            style={styles.buyNowBtn} 
            onPress={() => dispatch(addToCart(product))}
          >
            <Ionicons name="cart" size={24} color="white" style={{marginRight: 12}} />
            <Text style={styles.buyNowText}>Buy now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

//   სტილები 
const styles = StyleSheet.create({
  detailContainer: { flex: 1, backgroundColor: '#f8fafc' },
  navBar: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: 50, position: 'absolute', width: '100%', zIndex: 10 
  },
  navCircle: { backgroundColor: 'white', padding: 8, borderRadius: 20, elevation: 4 },
  rightNav: { flexDirection: 'row', gap: 10 },
  imageSection: { height: 400, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  mainImg: { width: '85%', height: '80%' },
  dotsRow: { flexDirection: 'row', gap: 6, position: 'absolute', bottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cbd5e1' },
  activeDot: { backgroundColor: '#334155', width: 20 },
  infoSheet: { 
    backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, 
    padding: 30, marginTop: -30, flex: 1, minHeight: 500 
  },
  detailPrice: { fontSize: 20, color: '#64748b', fontWeight: '600' },
  detailTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginVertical: 12 },
  sectionTitle: { fontSize: 16, color: '#64748b', marginTop: 10 },
  colorOptions: { flexDirection: 'row', gap: 12, marginVertical: 15 },
  colorCircle: { width: 35, height: 35, borderRadius: 18 },
  descText: { fontSize: 16, color: '#4b5563', lineHeight: 24, marginBottom: 30 },
  buyNowBtn: { 
    backgroundColor: '#2563eb', borderRadius: 20, padding: 20, 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center' 
  },
  buyNowText: { color: 'white', fontSize: 20, fontWeight: 'bold' }
});