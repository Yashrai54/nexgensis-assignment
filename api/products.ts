import apiClient from "./client";

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  images: string[];
  thumbnail: string;
  reviews: ProductReview[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export const getProducts = async (
  limit: number,
  skip: number
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>("/products", {
    params: {
      limit,
      skip,
    },
  });

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>(
    "/products/search",
    {
      params: {
        q: query,
        limit,
        skip,
      },
    }
  );

  return response.data;
};