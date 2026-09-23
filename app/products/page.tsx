"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductTable from "@/components/products/ProductTable";
import { getProducts, Product,searchProducts } from "@/api/products";
import ProductCardList from "@/components/products/ProductCardList";

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [limit, setLimit] = useState(10)
    const [pageIndex, setPageIndex] = useState(1)
    const [total, setTotal] = useState(0)
    const skip = (pageIndex - 1) * limit

    const [query, setQuery] = useState("")


    const handlePageChange = (pageIndex: number) => {
        setPageIndex(pageIndex)
    }
    const handleLimitChange = (limit: number) => {
        setLimit(limit)
    }

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                setError("");

                const data = query.trim()
                    ? await searchProducts(query, limit, skip)
                    : await getProducts(limit, skip);

                setProducts(data.products);
                setTotal(data.total);
            } catch {
                setError("Failed to load products.");
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, limit, pageIndex]);

    
    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-black p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex justify-between items-center">
                        <div className="mb-6">
                            <h1 className="text-3xl font-mono font-semibold">
                                Products
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 font-mono">
                                Manage your product catalog.
                            </p>
                        </div>

                        <input type="search" name="Search Products" id="search products"
                            placeholder="search for products"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value)
                                setPageIndex(1)
                            }}
                            className="bg-white py-3 w-[200px] text-black px-3 rounded-md font-mono text-sm"
                        />
                    </div>

                    {isLoading && (
                        <div className="py-10 text-center">
                            Loading products...
                        </div>
                    )}

                    {error && (
                        <div className="py-10 text-center text-red-500">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && (
                        <ProductTable
                            products={products}
                            total={total}
                            limit={limit}
                            pageIndex={pageIndex}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />)}
                    {!isLoading && !error && (
                        <ProductCardList
                            products={products}
                            total={total}
                            limit={limit}
                            pageIndex={pageIndex}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                        />)}
                </div>
            </main>
        </ProtectedRoute>
    );
};

export default ProductsPage;
