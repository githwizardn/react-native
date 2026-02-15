import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
// AsyncStorage საჭიროა, რომ სისტემამ დაიმახსოვროს, რომ მომხმარებელი შესულია
import AsyncStorage from '@react-native-async-storage/async-storage';


  // ვალიდაციის სქემა (Yup)
 
const loginSchema = yup.object().shape({
  // Username: მინიმუმ 3 სიმბოლო, მაქსიმუმ 20. მხოლოდ ასოები, ციფრები და ქვედა ტირე.
  username: yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username too long")
    .matches(/^[a-zA-Z0-9_]+$/, "Only letters, numbers and underscores are allowed"),

  // Password: მინიმუმ 6 სიმბოლო, აუცილებელია ერთი დიდი ასო, ერთი პატარა ასო და ერთი ციფრი და ერთი სპეციალური სიმბოლო.
  password: yup.string()
    .required("Password is required")
    .min(6, "Security alert: Password must be at least 6 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&]/, "Must contain at least one special character (@$!%*?&)")
});

export default function Login() {
  const router = useRouter();

  /**
   *  React Hook Form-ის კონფიგურაცია
   * control: აკავშირებს ინფუთებს ფორმასთან
   * handleSubmit: ფუნქცია, რომელიც ამოწმებს ვალიდაციას გაგზავნამდე
   * errors: აქ ინახება ვალიდაციის შეცდომები
   */
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  /**
   *  ავტორიზაციის ფუნქცია (onLogin)
   * data შეიცავს username-ს და password-ს
   */
  const onLogin = async (data: any) => {
    try {
      // სიმულაცია: რეალურ API-ს ნაცვლად ვიყენებთ სატესტო ტოკენს
      const fakeToken = "user_auth_token_xyz_123";
      
      // აუცილებელია ტოკენის შენახვა, რომ Profile გვერდმა იცოდეს ვინ შევიდა
      await AsyncStorage.setItem("token", fakeToken);
      await AsyncStorage.setItem("username", data.username);

      Alert.alert("Success", `Welcome, ${data.username}!`);

      /**
       *  გადამისამართება Profile გვერდზე
       * ვიყენებთ replace-ს, რომ მომხმარებელმა "Back" ღილაკით 
       * ვეღარ შეძლოს Login-ზე დაბრუნება შესვლის შემდეგ.
       */
      router.replace('/profile'); 
      
    } catch (error) {
      // თუ AsyncStorage-თან პრობლემა შეიქმნა
      Alert.alert("Error", "Could not save login session");
    }
  };

  return (
    <View style={styles.container}>
      {/* ზედა სექცია: სათაური */}
      <View style={styles.headerBox}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        
        {/*  Username ინფუთი */}
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Username" 
                // თუ შეცდომაა, ჩარჩო წითლდება styles.inputError-ით
                style={[styles.input, errors.username && styles.inputError]} 
                onChangeText={onChange} 
                value={value} 
                autoCapitalize="none"
              />
              {/* შეცდომის შეტყობინება ინფუთის ქვემოთ */}
              {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
            </View>
          )}
        />

        {/*  Password ინფუთი */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Password" 
                secureTextEntry // პაროლის სიმბოლოების დაფარვა
                style={[styles.input, errors.password && styles.inputError]} 
                onChangeText={onChange} 
                value={value} 
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>
          )}
        />

        {/*  Login ღილაკი - იძახებს handleSubmit-ს */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit(onLogin)}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        {/* რეგისტრაციაზე გადასასვლელი */}
        <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkBtn}>
          <Text style={styles.linkText}>
            Dont have an account? <Text style={styles.linkHighlight}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//  სტილები  
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 30, 
    justifyContent: 'center' 
  },
  headerBox: { 
    marginBottom: 40 
  },
  title: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#1e3a8a' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748b', 
    marginTop: 5 
  },
  form: { 
    gap: 15 
  },
  inputContainer: { 
    marginBottom: 10 
  },
  input: { 
    backgroundColor: '#f1f5f9', 
    padding: 18, 
    borderRadius: 15, 
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  inputError: { 
    borderColor: '#ef4444' 
  },
  errorText: { 
    color: '#ef4444', 
    fontSize: 12, 
    marginTop: 5, 
    marginLeft: 5 
  },
  loginBtn: { 
    backgroundColor: '#2563eb', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 4, 
    shadowColor: '#000',  
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  loginBtnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  linkBtn: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#64748b', 
    fontSize: 14 
  },
  linkHighlight: { 
    color: '#2563eb', 
    fontWeight: 'bold' 
  }
});