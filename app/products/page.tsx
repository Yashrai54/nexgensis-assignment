"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductTable from "@/components/products/ProductTable";
import { getCategories, getProducts, Product, searchProducts, ProductCategory, getProductByCategories } from "@/api/products";
import ProductCardList from "@/components/products/ProductCardList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);

    const searchParams = useSearchParams()
    const [limit, setLimit] = useState(
        Number(searchParams.get("limit")) || 10
    );

    const [pageIndex, setPageIndex] = useState(
        Number(searchParams.get("page")) || 1
    );
    const [total, setTotal] = useState(0)
    const skip = (pageIndex - 1) * limit

    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [category, setCategory] = useState(
        searchParams.get("category") || ""
    );

    const [sortBy, setSortBy] = useState(
        searchParams.get("sortBy") || ""
    );

    const [order, setOrder] = useState<"asc" | "desc">(
        searchParams.get("order") === "desc" ? "desc" : "asc"
    );


    const [query, setQuery] = useState(
        searchParams.get("search") || ""
    );

    const router = useRouter();


    const updateUrl = (updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        })
        router.push(`/products?${params.toString()}`);
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)
                setError("")

                const data = await getCategories()
                setCategories(data)
            } catch {
                setError("failed to load categories")
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const handlePageChange = (page: number) => {
        setPageIndex(page)
        updateUrl({
            page,
        });
    }

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPageIndex(1);

        updateUrl({
            limit: newLimit,
            page: 1,
        });
    };

    const handleSearchChange = (value: string) => {
        setQuery(value);
        setPageIndex(1);

        updateUrl({
            search: value,
            page: 1,
        });
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setPageIndex(1);

        updateUrl({
            category: value,
            page: 1,
        });
    };

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                setError("");

                let data;

                if (category === "") {
                    data = query.trim()
                        ? await searchProducts(query, limit, skip, sortBy, order)
                        : await getProducts(limit, skip, sortBy, order);
                } else {
                    data = await getProductByCategories(
                        category,
                        limit,
                        skip,
                        sortBy,
                        order
                    );
                }

                setProducts(data.products);
                setTotal(data.total);
            } catch {
                setError("Failed to load products.");
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, limit, pageIndex, category, sortBy, order]);


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
                        <div className="flex gap-5">
                            <input type="search" name="Search Products" id="search products"
                                placeholder="search for products"
                                value={query}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setQuery(value);
                                    setPageIndex(1);

                                    updateUrl({
                                        search: value,
                                        page: 1,
                                    });
                                }}
                                className="bg-white py-3 text-black px-3 rounded-md font-mono text-sm"
                            />
                            <select
                                value={category}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setCategory(value);
                                    setPageIndex(1);

                                    updateUrl({
                                        category: value,
                                        page: 1,
                                    });
                                }}
                                className="rounded-md bg-white px-3 py-3 text-sm font-mono text-black"
                            >
                                <option value="">All Categories</option>

                                {categories.map((category) => (
                                    <option key={category.slug} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={`${sortBy}-${order}`}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setPageIndex(1);

                                    if (!value) {
                                        setSortBy("");
                                        setOrder("asc");

                                        updateUrl({
                                            sortBy: null,
                                            order: null,
                                            page: 1,
                                        });

                                        return;
                                    }

                                    const [newSortBy, newOrder] = value.split("-");

                                    setSortBy(newSortBy);
                                    setOrder(newOrder as "asc" | "desc");

                                    updateUrl({
                                        sortBy: newSortBy,
                                        order: newOrder,
                                        page: 1,
                                    });
                                }}
                                className="rounded-md bg-white px-3 py-3 text-sm font-mono text-black"
                            >
                                <option value="">Sort By</option>

                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>

                                <option value="rating-asc">Rating: Low to High</option>
                                <option value="rating-desc">Rating: High to Low</option>

                                <option value="title-asc">Title: A to Z</option>
                                <option value="title-desc">Title: Z to A</option>
                            </select>
                        </div>
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
