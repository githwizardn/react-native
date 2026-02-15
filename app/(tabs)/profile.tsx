import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfilePage() {
  //  State-ები: isLoggedIn ინახავს არის თუ არა მომხმარებელი შესული, loading კი - ჩატვირთვის პროცესს
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //  useEffect: გვერდის ჩატვირთვისას ერთხელ უშვებს ავტორიზაციის შემოწმებას
  useEffect(() => {
    checkAuth();
  }, []);

  //  checkAuth: ამოწმებს ტელეფონის მეხსიერებაში (AsyncStorage) არის თუ არა შენახული "token"
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token); // თუ ტოკენი არსებობს, გახდება true, თუ არა - false
    setLoading(false);      // შემოწმება დასრულდა
  };

  //  handleLogout: გამოსვლის ფუნქცია
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token"); // მეხსიერებიდან ვშლით ტოკენს
    setIsLoggedIn(false);                   // სტატუსს ვცვლით false-ზე
    router.replace('/');               // გადავდივართ მთავარ გვერდზე
  };

  //  სანამ შემოწმება მიმდინარეობს, ეკრანზე არაფერი გამოჩნდეს (ან შეიძლება Spinner-ის ჩასმა)
  if (loading) return null;

  //  თუ მომხმარებელი არ არის შესული, ვაჩვენებთ "Guest" (სტუმრის) ხედს
  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 50 }}>👤</Text>
        </View>
        <Text style={styles.title}>You are not signed in</Text>
        <Text style={styles.subtitle}>Log in to track orders and manage your profile</Text>
        
        {/* ღილაკი, რომელიც მომხმარებელს ლოგინის გვერდზე გადაიყვანს */}
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // თუ მომხმარებელი ავტორიზებულია, ვაჩვენებთ მის პროფილს
  return (
    <View style={styles.container}>
      {/* პროფილის ზედა ნაწილი: ავატარი და სახელი */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/150?u=guest' }} style={styles.avatar} />
        <Text style={styles.name}>Welcome Back!</Text>
        <Text style={styles.email}>john@gmail.com</Text>
      </View>

      {/* პროფილის მენიუ */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/favorites')}>
          <Text>My Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cart')}>
          <Text>My Cart</Text>
        </TouchableOpacity>
        
        {/* გამოსვლის ღილაკი */}
        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
          <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//  სტილები  

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 10, marginBottom: 30 },
  loginBtn: { backgroundColor: '#2563eb', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 15, width: '100%', alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white' },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  email: { color: '#64748b' },
  menu: { backgroundColor: 'white', borderRadius: 20, padding: 10 },
  menuItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }
});