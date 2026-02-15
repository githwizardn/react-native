import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { toggleWishlist } from '../../store/wishlistSlice';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';  

//  პროდუქტის ტიპის განსაზღვრა
type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  
  const router = useRouter(); 
  const dispatch = useDispatch();
  const wishlist = useSelector((state: any) => state.wishlist.items);

  //  მონაცემების წამოღება API-დან
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }, []);

  //  ძებნის ფუნქცია
  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = products.filter((p: Product) => 
      p.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <View style={styles.container}>
      {/* ზედა სათაური */}
      <Text style={styles.header}>Explore</Text>
      
      {/* საძიებო ველი */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#94a3b8" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchBar}
          placeholder="Search products..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* პროდუქტების სია (Grid) */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isFav = wishlist.some((i: Product) => i.id === item.id);
          
          return (
            <View style={styles.card}>
              {/*  ზედა მარჯვენა მოქმედებები (შედარება და ფავორიტი) */}
              <View style={styles.topActions}>
                
                <TouchableOpacity 
                  style={styles.actionCircle} 
                  onPress={() => dispatch(toggleWishlist(item))}
                >
                  <Ionicons 
                    name={isFav ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isFav ? "#ef4444" : "black"} 
                  />
                </TouchableOpacity>
              </View>
              
              {/*  პროდუქტის სურათი - დაჭერისას გადადის დეტალებზე */}
              <TouchableOpacity 
                onPress={() => router.push(`/product/${item.id}`)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
              </TouchableOpacity>
              
              {/*  ინფორმაცია: სათაური და ფასი */}
              <View style={styles.infoBox}>
                <Text numberOfLines={2} style={styles.productTitle}>{item.title}</Text>
                <Text style={styles.productPrice}>{item.price}₾</Text>
              </View>
              
              {/*  ქვედა ნაწილი: კალათა და იისფერი ყიდვის ღილაკი   */}
              <View style={styles.cardFooter}>
                <TouchableOpacity 
                  style={styles.miniCartBtn} 
                  onPress={() => dispatch(addToCart(item))}
                >
                  <Ionicons name="cart-outline" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.buyBtn} 
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <Text style={styles.buyBtnText}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 10 },
  header: { fontSize: 32, fontWeight: '900', color: '#1e293b', marginBottom: 15, marginTop: 50, paddingHorizontal: 5 },
  
  // საძიებო ველის სტილი
  searchContainer: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    borderRadius: 15, paddingHorizontal: 15, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  searchIcon: { marginRight: 10 },
  searchBar: { flex: 1, paddingVertical: 12, fontSize: 16 },

  // ბარათის სტილი  
  card: { 
    flex: 0.5, backgroundColor: 'white', margin: 6, padding: 12, 
    borderRadius: 25, // დიდი რადიუსი
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    position: 'relative' 
  },
  
  // ზედა ღილაკების სტილი
  topActions: { position: 'absolute', top: 10, right: 10, zIndex: 10, gap: 8 },
  actionCircle: { 
    backgroundColor: 'white', padding: 8, borderRadius: 20, 
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 
  },
  
  imageContainer: { alignItems: 'center', marginTop: 20 },
  image: { width: '90%', height: 130 },
  
  infoBox: { marginTop: 15, paddingHorizontal: 2 },
  productTitle: { fontSize: 13, fontWeight: '600', color: '#334155', height: 35 },
  productPrice: { fontSize: 20, fontWeight: '900', color: '#0f172a', marginTop: 5 },

  // ქვედა ღილაკების სტილი
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 15, gap: 8 },
  miniCartBtn: { 
    padding: 10, backgroundColor: '#f1f5f9', borderRadius: 15 
  },
  buyBtn: { 
    flex: 1, 
    backgroundColor: '#7c4dff', // იისფერი   
    paddingVertical: 10, borderRadius: 18, alignItems: 'center' 
  },
  buyBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 }
});