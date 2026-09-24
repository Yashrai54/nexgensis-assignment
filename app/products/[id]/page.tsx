"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getProductById, Product } from "@/api/products";

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const id = Number(params.id);

        if (!Number.isInteger(id) || id <= 0) {
          setError("Product not found.");
          return;
        }

        const data = await getProductById(id);

        setProduct(data);
      } catch {
        setError("Product not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-black p-8 text-white">
        <div className="mx-auto max-w-6xl">

          <button
            onClick={() => router.back()}
            className="mb-6 font-mono text-yellow-500"
          >
            ← Back
          </button>

          {isLoading && (
            <div className="py-10 text-center">
              Loading product...
            </div>
          )}

          {error && (
            <div className="py-10 text-center text-red-500">
              {error}
            </div>
          )}

          {!isLoading && !error && product && (
            <div className="grid gap-10 md:grid-cols-2">

              <div>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full rounded-lg bg-white object-contain"
                />
              </div>

              <div className="font-mono">
                <h1 className="mb-4 text-4xl font-semibold">
                  {product.title}
                </h1>

                <p className="mb-6 text-gray-400">
                  {product.description}
                </p>

                <div className="mb-6 text-3xl text-yellow-500">
                  ${product.price}
                </div>

                <div className="space-y-2">
                  <p>Category: {product.category}</p>
                  <p>Brand: {product.brand}</p>
                  <p>Rating: {product.rating}</p>
                  <p>Stock: {product.stock}</p>
                  <p>SKU: {product.sku}</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default ProductDetailsPage;