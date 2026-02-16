import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { usePagination } from '../hooks/usePagination';
import { fetchProducts, Product } from '../api/productApi';
import ProductItem from '../components/ProductItem';
import Toast  from 'react-native-toast-message';
import { useDebounce } from '../hooks/useDebounce';

export default function ProductListScreen() {
  const [search, setSearch] = useState('');

  // 🔥 Debounce for 500ms
  const debouncedSearch = useDebounce(search, 500);

  const { 
    data, 
    loadMore, 
    refresh, 
    loading, 
    refreshing, 
    hasMore, 
    error 
  } = usePagination<Product>({
      apiFunction: fetchProducts,
      limit: 10,
      search: debouncedSearch,
    });

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        position: 'top',
      });
    }
  }, [error]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ProductItem item={item} />}
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        refreshing={refreshing} // 🔥 NEW
        onRefresh={refresh} // 🔥 NEW
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#464444',
    borderRadius: 24,
    margin: 16,
  },
});
