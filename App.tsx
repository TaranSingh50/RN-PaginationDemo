/**
   Lesson 18: Pagination API Pattern
   Lesson 19: Pull to Refresh + Pagination
   Lesson 20: Search + Pagination
   Lesson 21: Debounced Search + Pagination
 */
import React from 'react';
import ProductListScreen from './src/screens/ProductListScreen';
import { StatusBar, useColorScheme} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f0f0' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ProductListScreen />
      <Toast />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;


// Source: https://chatgpt.com/share/698ae6cf-be4c-8009-b675-5142988e6dd4