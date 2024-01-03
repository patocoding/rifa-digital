import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { supabase } from '../lib/supabase'; // Ajuste o caminho conforme necessário
import Auth from '../components/Auth'; // Ajuste o caminho conforme necessário
import Account from '../components/Account'; // Ajuste o caminho conforme necessário
import { Session } from '@supabase/supabase-js';
import Home from '../components/Home';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpar o listener quando o componente for desmontado
    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
     <SafeAreaProvider>
      <View>
        {session && session.user ? <RootLayoutNav/> : <Auth />}
       </View>
   </SafeAreaProvider>
  );

  
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView>
       <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <>
      <Text>
        Dionizio gayyyyyyyyyyyysaddsasad
      </Text>
      <Stack>
         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
       </Stack>
    </>
     </ThemeProvider>
    </SafeAreaView>
    
  );
}
