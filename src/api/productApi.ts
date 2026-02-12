import axios from 'axios';

export interface Product {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
}

export interface ProductResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

const api = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

export const fetchProducts = async (
    limit:number,
    skip:number
): Promise<ProductResponse> => {
    const response = await api.get<ProductResponse>(
        `/products?limit=${limit}&skip=${skip}`
    );
    
    return response.data;
}