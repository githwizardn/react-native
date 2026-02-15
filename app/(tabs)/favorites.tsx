import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleWishlist } from '../../store/wishlistSlice';
import { addToCart } from '../../store/cartSlice';

export default function FavoritesPage() {
  //  Redux Store-დან ვიღებთ ფავორიტების მასივს
  const wishlist = useSelector((state: any) => state.wishlist.items);
  const dispatch = useDispatch();

  //  თუ ფავორიტების სია ცარიელია, ვაჩვენებთ შესაბამის შეტყობინებას
  if (wishlist.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={{ fontSize: 50 }}>⭐</Text>
        <Text style={styles.emptyText}>Wishlist is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      
      {/* ვიყენებთ FlatList-ს ფავორიტი ნივთების ეფექტურად გამოსაჩენად */}
      <FlatList
        data={wishlist} // მონაცემების წყარო
        keyExtractor={(item) => item.id.toString()} // თითოეული ელემენტის უნიკალური გასაღები
        renderItem={({ item }) => (
          <View style={styles.item}>
            {/* პროდუქტის სურათი */}
            <Image source={{ uri: item.image }} style={styles.img} resizeMode="contain" />
            
            {/* პროდუქტის სახელი და ფასი */}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.name}>{item.title}</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>

            {/* 4. ღილაკი "Add to Cart": ნივთის დამატება კალათაში პირდაპირ ფავორიტებიდან */}
            <TouchableOpacity 
              onPress={() => dispatch(addToCart(item))} 
              style={styles.btn}
            >
              <Text style={{ color: 'white' }}>Add to Cart</Text>
            </TouchableOpacity>

            {/*  წაშლის ღილაკი (❌): იყენებს toggleWishlist-ს ნივთის სიიდან ამოსაღებად */}
            <TouchableOpacity onPress={() => dispatch(toggleWishlist(item))}>
              <Text style={{ fontSize: 20, marginLeft: 10 }}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

//  სტილები 

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  header: { fontSize: 28, fontWeight: '900', marginBottom: 20, marginTop: 20 },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 15, backgroundColor: '#f8fafc', borderRadius: 15 },
  img: { width: 50, height: 50, marginRight: 15 },
  name: { fontWeight: 'bold' },
  price: { color: '#2563eb', fontWeight: 'bold' },
  btn: { backgroundColor: '#111', padding: 8, borderRadius: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#64748b', marginTop: 10 }
});
