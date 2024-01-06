import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState(''); // Você pode querer usar um date picker aqui
  const [isSigningUp, setIsSigningUp] = useState(false);

  const isAdmin = false;
  
  function toggleSignInSignUp() {
    setIsSigningUp(!isSigningUp);
  }

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    
    if (session && session.user) {
        // O cadastro foi bem-sucedido, e o usuário foi criado
        const user = session.user;
        Alert.alert(user.id)
            // Insira os dados adicionais na tabela 'profiles'
            const { data,error: profileError } = await supabase.from('profiles').insert([
              { 
                first_name: firstName,
                last_name: lastName,
                birthday: birthday,
                is_admin: isAdmin
              }
            ]).select();
        // Aqui você pode continuar com a inserção na tabela 'profiles'
        // ...
        if(profileError) Alert.alert(profileError.message)
        }
      
   
    if (error) Alert.alert(error.message)
    if (session) console.log(session.user.id)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      {!isSigningUp && (
    <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
  )}

  {/* Botão para trocar para Sign Up */}
  {!isSigningUp && (
    <View style={styles.verticallySpaced}>
        <Button title="Sign up" onPress={toggleSignInSignUp}/>
    </View>
    
  )}
     
      
      
  

{isSigningUp && (
  <>
    {/* Campo para First Name */}
    <View style={styles.verticallySpaced}>
      <Input
        label="First Name"
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
      />
    </View>

    {/* Campo para Last Name */}
    <View style={styles.verticallySpaced}>
      <Input
        label="Last Name"
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
      />
    </View>

    {/* Campo para Birthday */}
    <View style={styles.verticallySpaced}>
      <Input
        label="Birthday"
        onChangeText={setBirthday}
        value={birthday}
        placeholder="YYYY-MM-DD" // Exemplo de formato
      />
    </View>
    <View style={styles.verticallySpaced}>
    <Button title="Criar Conta" disabled={loading} onPress={signUpWithEmail} />
    <Button title="Quero fazer Login" disabled={loading} onPress={() => setIsSigningUp(false)} />
  </View>
  </>
  
)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})