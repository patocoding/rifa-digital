import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Routes from "./src/routes";

import { supabase } from './src/lib/supabase'; // Ajuste o caminho conforme necessário
import Auth from './src/components/Auth'; // Ajuste o caminho conforme necessário
import Account from './src/components/Account'; // Ajuste o caminho conforme necessário
import { Session } from '@supabase/supabase-js';

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

const App = () => (
  <NavigationContainer>
    <Routes />
  </NavigationContainer>
);

export default App;
