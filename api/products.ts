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

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export const getProducts = async (
  limit: number,
  skip: number,
  sortBy?:string,
  order?:"asc"|"desc"
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>("/products", {
    params: {
      limit,
      skip,
      ...(sortBy && {sortBy}),
      ...(order && ({order}))
    },
  });

  return response.data;
};

export const searchProducts = async (
  query: string,
  limit: number,
  skip: number,
  sortBy?: string,
  order?: "asc" | "desc"
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>(
    "/products/search",
    {
      params: {
        q: query,
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(order && { order }),
      },
    }
  );

  return response.data;
};

export const getCategories = async (): Promise<ProductCategory[]> => {
  const response = await apiClient.get<ProductCategory[]>(
    "/products/categories"
  );

  return response.data;
};

export const getProductByCategories = async (
  category: string,
  limit: number,
  skip: number,
  sortBy?: string,
  orderBy?: "asc" | "desc"
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>(
    `/products/category/${category}`,
    {
      params: {
        limit,
        skip,
        ...(sortBy && { sortBy }),
        ...(orderBy && { orderBy }),
      },
    }
  );

  return response.data;
};