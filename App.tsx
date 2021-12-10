
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { Register} from './src/screans/Register';
import theme from './src/global/styles/theme';
import {ThemeProvider} from 'styled-components';
import AppLoading from 'expo-app-loading';
import{useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { Routes} from './src/Routes';
import { AppRoutes } from './src/Routes/app.routes';
import { AuthProvider } from './src/Hooks/auth';


import {StatusBar} from 'react-native';
import { SignIn } from './src/screans/signin';


export default function App() {



  const [fontsLoaded]=useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold

  });
  if(!fontsLoaded){
    return<AppLoading />
  }
  return (
    <ThemeProvider theme={theme}>

      
      <StatusBar barStyle='light-content' />

      <AuthProvider>
        <SignIn />
      </AuthProvider>
      
  

    </ThemeProvider>
      
      
      
      

    


    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
