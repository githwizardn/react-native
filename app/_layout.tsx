import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    //  Redux Provider: მთელ აპლიკაციას აწვდის წვდომას Store-ზე (კალათა, ფავორიტები და ა.შ.)
    <Provider store={store}>
      
      {/*  SafeAreaProvider: უზრუნველყოფს, რომ აპლიკაცია სწორად ჩაჯდეს ეკრანის საზღვრებში 
          (არ შევიდეს "კამერის ჭრილის" ან ტელეფონის ქვედა ღილაკების ქვეშ) */}
      <SafeAreaProvider>
        
        {/*  Stack ნავიგაცია: მართავს გვერდების გადაფარვას (LIFO პრინციპი) */}
        <Stack screenOptions={{ headerShown: false }}>
          
          {/*  (tabs): მთავარი ნავიგაცია. რადგან პირველია, აპლიკაცია აქედან იხსნება */}
          <Stack.Screen name="(tabs)" /> 
          
          {/*  login: მითითებული აქვს presentation: 'modal', რაც ნიშნავს, რომ 
              iOS-ზე გვერდი ქვემოდან ამოვა და არა გვერდიდან */}
          <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: true, title: 'Login' }} />
          
          {/* register: ჩვეულებრივი გვერდი თავისი სათაურით */}
          <Stack.Screen name="register" options={{ headerShown: true, title: 'Register' }} />
          
          {/*  product/[id]: დინამიური გვერდი პროდუქტებისთვის. 
              აქ headerShown: true არის, რათა "უკან დაბრუნების" ღილაკი ავტომატურად გამოჩნდეს */}
          <Stack.Screen name="product/[id]" options={{ headerShown: true, title: 'Product Details' }} />
        </Stack>

      </SafeAreaProvider>
    </Provider>
  );
}