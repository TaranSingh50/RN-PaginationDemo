import React, { use, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { usePagination } from '../hooks/usePagination';
import { fetchProducts, Product } from '../api/productApi';
import ProductItem from '../components/ProductItem'
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function ProductListScreen() {
  const { data, loadMore, loading, hasMore, error } = usePagination<Product>({
    apiFunction: fetchProducts,
    limit: 10,
  });

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if(error){
      Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error,
      position: 'top',
    });
    }
  }, [error])

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
            <ProductItem item={item} />
        )}
        onEndReached={() => {
          if (hasMore) loadMore();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
}
