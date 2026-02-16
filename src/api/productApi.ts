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
});

/* export const fetchProducts = async (
  limit: number,
  skip: number,
): Promise<ProductResponse> => {
  const response = await api.get<ProductResponse>(
    `/products?limit=${limit}&skip=${skip}`,
  );

  return response.data;
};
 */

/*  AbortController =>
    We will fix a serious real-world problem:
    ❗ When user types fast → multiple API calls 
    happen → older request may finish after newer 
    one → UI shows wrong data.

    This is called a race condition. 
    We’ll use AbortController (modern Axios way).
*/

export const fetchProducts = async (
  limit: number,
  skip: number,
  search?: string,
  signal?: AbortSignal
): Promise<ProductResponse> => {
  const endpoint = search
    ? `/products/search?q=${search}&limit=${limit}&skip=${skip}`
    : `/products?limit=${limit}&skip=${skip}`;

  const response = await api.get<ProductResponse>(endpoint, {
    signal,
  });

  return response.data;
};
