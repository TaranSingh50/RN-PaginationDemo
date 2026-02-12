import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Product } from '../api/productApi'

interface Props {
    item: Product;
}

export default function ProductItem({ item }: Props) {
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: 80,
        height: 80,
        marginRight: 10,
    },
    info: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 14,
        color: '#888',
    },
})