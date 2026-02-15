import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // აიქონებისთვის ვიყენებთ Ionicons-ს

// ვალიდაციის სქემა
const registerSchema = yup.object().shape({
  //  Username:  მინიმუმ 3 სიმბოლო, მაქსიმუმ 20. მხოლოდ ასოები, ციფრები და ქვედა ტირე.
  username: yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores allowed"),

  //  იმეილის ვალიდაცია
  email: yup.string()
    .required("Email is required")
    .email("Invalid email format"),

  //  Password: ძლიერი პაროლის წესები 
  password: yup.string()
    .required("Password is required")
    .min(8, "Security alert: Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain one uppercase letter")
    .matches(/[0-9]/, "Must contain one number")
    .matches(/[@$!%*?&]/, "Must contain one special character"),

  //  Confirm Password: ამოწმებს ემთხვევა თუ არა ზედა პაროლს
  confirmPassword: yup.string()
    .required("Please confirm your password")
    // yup.ref('password') პირდაპირ უკავშირდება პაროლის ველს
    .oneOf([yup.ref('password')], "Passwords do not match. Please try again")
});

export default function Register() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm({ 
    resolver: yupResolver(registerSchema) 
  });

  const onRegister = (data: any) => {
    console.log("Registered:", data);
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* ლოგო  */}
        <View style={styles.headerSection}>
          <View style={styles.blueAvatar}>
            <Ionicons name="person" size={60} color="white" />
            <View style={styles.plusIconContainer}>
              <Ionicons name="add" size={20} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          
          {/*  Username ველი */}
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, errors.username && styles.errorInput]}>
                  <Ionicons name="person-outline" size={22} color="#94a3b8" style={styles.fieldIcon} />
                  <TextInput 
                    placeholder="username" 
                    style={styles.textInput} 
                    onChangeText={onChange} 
                    value={value}
                    autoCapitalize="none"
                  />
                </View>
                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
              </View>
            )}
          />

          {/*  Email ველი  */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, errors.email && styles.errorInput]}>
                  <Ionicons name="mail-outline" size={22} color="#94a3b8" style={styles.fieldIcon} />
                  <TextInput 
                    placeholder="email address" 
                    style={styles.textInput} 
                    onChangeText={onChange} 
                    value={value}
                    keyboardType="email-address" // ელ-ფოსტისთვის მოსახერხებელი კლავიატურა
                    autoCapitalize="none"
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          {/*  პაროლის ველი */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, errors.password && styles.errorInput]}>
                  <Ionicons name="lock-closed-outline" size={22} color="#94a3b8" style={styles.fieldIcon} />
                  <TextInput 
                    placeholder="password" 
                    secureTextEntry 
                    style={styles.textInput} 
                    onChangeText={onChange} 
                    value={value} 
                  />
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>
            )}
          />

          {/*  პაროლის გამეორება */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputGroup}>
                <View style={[styles.inputWrapper, errors.confirmPassword && styles.errorInput]}>
                  <Ionicons name="lock-closed-outline" size={22} color="#94a3b8" style={styles.fieldIcon} />
                  <TextInput 
                    placeholder="confirm password" 
                    secureTextEntry 
                    style={styles.textInput} 
                    onChangeText={onChange} 
                    value={value} 
                  />
                </View>
                {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}
              </View>
            )}
          />

          {/* რეგისტრაციის ღილაკი */}
          <TouchableOpacity style={styles.registerBtn} onPress={handleSubmit(onRegister)}>
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>

          {/* Login-ზე გადასასვლელი */}
          <TouchableOpacity onPress={() => router.push('/login')} style={styles.footerLink}>
            <Text style={styles.footerLinkText}>already have an account? sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 35 },
  headerSection: { alignItems: 'center', marginBottom: 60 },
  blueAvatar: { 
    width: 120, height: 120, borderRadius: 60, 
    backgroundColor: '#4e95ff', justifyContent: 'center', alignItems: 'center' 
  },
  plusIconContainer: { 
    position: 'absolute', bottom: 5, right: 10, 
    backgroundColor: '#4e95ff', borderRadius: 15, 
    borderWidth: 3, borderColor: 'white', padding: 2 
  },
  formContainer: { width: '100%' },
  inputGroup: { marginBottom: 15 },
  inputWrapper: { 
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#f1f5f9', borderRadius: 30, paddingHorizontal: 20 
  },
  fieldIcon: { marginRight: 12 },
  textInput: { flex: 1, paddingVertical: 18, fontSize: 16, color: '#334155' },
  errorInput: { borderWidth: 1, borderColor: '#ff4d4d' },
  errorText: { color: '#ff4d4d', fontSize: 12, marginTop: 5, marginLeft: 15 },
  registerBtn: { 
    backgroundColor: '#4e95ff', borderRadius: 35, paddingVertical: 18, 
    alignItems: 'center', marginTop: 30, elevation: 4,
    shadowColor: '#4e95ff', shadowOpacity: 0.4, shadowRadius: 10 
  },
  registerBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  footerLink: { marginTop: 20, alignItems: 'center' },
  footerLinkText: { color: '#4e95ff', fontSize: 16, fontWeight: '600' }
});