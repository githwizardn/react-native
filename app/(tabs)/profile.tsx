import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker'; // 
import { Ionicons } from '@expo/vector-icons';

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<string | null>(null); // State პროფილის სურათისთვის
  const router = useRouter();

  // აპლიკაციის ჩატვირთვისას ვამოწმებთ ავტორიზაციას და ვტვირთავთ სურათს
  useEffect(() => {
    checkAuth();
    loadProfileImage();
  }, []);

  /**
   * ავტორიზაციის შემოწმება AsyncStorage-დან
   */
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  /**
   * სურათის წამოღება AsyncStorage-დან 
   */
  const loadProfileImage = async () => {
    const savedImage = await AsyncStorage.getItem("user_profile_image");
    if (savedImage) setImage(savedImage);
  };

  const pickImage = async () => {
    //  ვითხოვთ გალერეაზე წვდომის უფლებას (Permissions)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required', 
        'In order to change your profile picture, we need gallery access.'
      );
      return;
    }

    //  ვხსნით გალერეას
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // სურათის მოჭრის ფუნქცია
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      
      //  შენახვა AsyncStorage-ში, რომ აპლიკაციის რესტარტისას არ წაიშალოს
      await AsyncStorage.setItem("user_profile_image", selectedUri);
    }
  };

  /**
   * გამოსვლის ფუნქცია
   */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
    router.replace('/');
  };

  // Loading State - ეკრანის ჩატვირთვისას
  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>
  );

  // --- თუ მომხმარებელი არ არის ავტორიზებული ---
  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-outline" size={50} color="#64748b" />
        </View>
        <Text style={styles.title}>You are not signed in</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.btnText}>Login / Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {/* სურათის შეცვლის ღილაკი */}
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          {image ? (
            <Image source={{ uri: image }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar]}>
              <Ionicons name="camera" size={40} color="#cbd5e1" />
            </View>
          )}
          {/* პატარა "Edit" აიქონი */}
          <View style={styles.editBadge}>
            <Ionicons name="pencil" size={14} color="white" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>Welcome Back!</Text>
        <Text style={styles.email}>user@example.com</Text>
      </View>

      <View style={styles.menu}>
        {/* მენიუს პუნქტი: კალათა */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={20} color="#475569" />
          <Text style={styles.menuText}>My Cart</Text>
        </TouchableOpacity>
        
        {/* მენიუს პუნქტი: გამოსვლა */}
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomWidth: 0 }]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={[styles.menuText, { color: '#ef4444', fontWeight: 'bold' }]}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* დამატებითი ინფორმაცია დავალების შესახებ */}
      <View style={styles.footerNote}>
        <Text style={styles.noteText}>Permissions & AsyncStorage implemented.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  loginBtn: { backgroundColor: '#2563eb', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 15, width: '100%', alignItems: 'center', marginTop: 20 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  profileHeader: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: 'white' },
  placeholderAvatar: { backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#cbd5e1' },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#2563eb', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  email: { color: '#64748b' },
  menu: { backgroundColor: 'white', borderRadius: 20, padding: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuText: { marginLeft: 15, fontSize: 16, color: '#1e293b' },
  footerNote: { marginTop: 40, alignItems: 'center' },
  noteText: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }
});