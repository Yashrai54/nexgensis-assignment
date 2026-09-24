"use client";

import { useEffect, useState,useCallback } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductTable from "@/components/products/ProductTable";
import { getCategories, getProducts, Product, searchProducts, ProductCategory, getProductByCategories, addProduct } from "@/api/products";
import ProductCardList from "@/components/products/ProductCardList";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { applyOverridesToList, getLocallyAddedProducts, recordAddedProduct, generateLocalId } from "@/lib/productOverrides";

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [addedProducts, setAddedProducts] = useState<Product[]>([]);

    const searchParams = useSearchParams()
    const [isAdding, setIsAdding] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [limit, setLimit] = useState(
        Number(searchParams.get("limit")) || 10
    );

    const [addForm, setAddForm] = useState({
        title: "",
        price: "",
        stock: "",
        description: "",
        category: "",
    });
    const [addFormError, setAddFormError] = useState("");

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
                setIsCategoriesLoading(true)
                setCategoriesError("")

                const data = await getCategories()
                setCategories(data)
            } catch {
                setCategoriesError("failed to load categories")
            } finally {
                setIsCategoriesLoading(false)
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


    const handleAddProduct = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!addForm.title.trim()) {
            setAddFormError("Title is required.");
            return;
        }

        if (!addForm.description.trim()) {
            setAddFormError("Description is required.");
            return;
        }

        const priceNum = Number(addForm.price);
        const stockNum = Number(addForm.stock);

        if (addForm.price === "" || Number.isNaN(priceNum) || priceNum < 0) {
            setAddFormError("Price is required and cannot be negative.");
            return;
        }

        if (addForm.stock === "" || Number.isNaN(stockNum) || stockNum < 0) {
            setAddFormError("Stock is required and cannot be negative.");
            return;
        }

        try {
            setIsAdding(true);
            setAddFormError("");

            const newProduct = await addProduct({
                title: addForm.title,
                price: priceNum,
                stock: stockNum,
                description: addForm.description,
                category: addForm.category || undefined,
            });

            const persistedProduct: Product = {
                ...newProduct,
                id: generateLocalId(),
            };
            recordAddedProduct(persistedProduct);


            setAddedProducts((current) => [
                newProduct,
                ...current,
            ]);

            setProducts((currentProducts) => [persistedProduct, ...currentProducts]);
            setIsAddModalOpen(false);
            setAddForm({ title: "", price: "", stock: "", description: "", category: "" });
        } catch {
            setAddFormError("Failed to add product.");
        } finally {
            setIsAdding(false);
        }
    };
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
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true); // categories loading

    const [error, setError] = useState("");
    const [categoriesError,setCategoriesError] = useState("")

    const fetchProducts = useCallback(async () => {
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

            const merged = applyOverridesToList(data.products, data.total);

            const showAdded =
                pageIndex === 1 && category === "" && query.trim() === "" && sortBy === "";

            const finalProducts = showAdded
                ? [...getLocallyAddedProducts(), ...merged.products]
                : merged.products;

            setProducts(finalProducts);


            setTotal(merged.total);
        } catch {
            setError("Failed to load products.");
        } finally {
            setIsLoading(false);
        }
    },[query,limit,skip,pageIndex,category,sortBy,order])

    useEffect(() => {
        const timer = setTimeout(async () => {
            fetchProducts()
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchProducts]);


    return (
        <ProtectedRoute>
            <main className="min-h-screen bg-black p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6">
                            <h1 className="text-3xl font-mono font-semibold">
                                Products
                            </h1>

                            <p className="mt-1 text-sm text-gray-500 font-mono">
                                Manage your product catalog.
                            </p>
                        </div>
                        {isAddModalOpen && (
                            <div className="fixed inset-0 z-50  flex items-center justify-center bg-black/60 p-4">
                                <div className="w-full max-w-md rounded-lg bg-white p-6 text-black">
                                    <h2 className="mb-4 text-xl font-semibold font-mono ">
                                        Add Product
                                    </h2>

                                    {addFormError && (
                                        <div className="mb-4 text-sm text-red-600 font-mono">
                                            {addFormError}
                                        </div>
                                    )}

                                    <form onSubmit={handleAddProduct} className="space-y-4 font-mono">
                                        <div>
                                            <label className="mb-1 block text-sm">
                                                Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                value={addForm.title}
                                                onChange={(e) =>
                                                    setAddForm({ ...addForm, title: e.target.value })
                                                }
                                                className="w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={addForm.price}
                                                onChange={(e) =>
                                                    setAddForm({ ...addForm, price: e.target.value })
                                                }
                                                className="w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm">
                                                Stock <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={addForm.stock}
                                                onChange={(e) =>
                                                    setAddForm({ ...addForm, stock: e.target.value })
                                                }
                                                className="w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm">
                                                Description <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                value={addForm.description}
                                                onChange={(e) =>
                                                    setAddForm({ ...addForm, description: e.target.value })
                                                }
                                                className="w-full rounded border px-3 py-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm">Category</label>
                                            <select
                                                disabled={isCategoriesLoading}
                                                value={addForm.category}
                                                onChange={(e) =>
                                                    setAddForm({ ...addForm, category: e.target.value })
                                                }
                                                className="w-full rounded border px-3 py-2"
                                            >
                                                <option value="">None</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.slug} value={cat.name}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex gap-3 pt-2 ">
                                            <button
                                                type="submit"
                                                disabled={isAdding}
                                                className="flex-1 rounded bg-yellow-500 py-2 disabled:opacity-50 "
                                            >
                                                {isAdding ? "Adding..." : "Add Product"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsAddModalOpen(false);
                                                    setAddFormError("");
                                                }}
                                                className="flex-1 rounded border py-2"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col md:flex-row mb-10 md:mb-0 gap-5">
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
                                className="rounded-md bg-white  px-3 py-3 text-sm font-mono text-black"
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
                            <button className="bg-yellow-500 py-3 w-50 font-mono rounded-md"
                                onClick={() => setIsAddModalOpen(true)}
                            >
                                Add Product
                            </button>
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
                        products.length === 0 ? (
                            <div className="text-2xl text-white font-mono m-auto">
                                No Products Found
                            </div>
                        ) :
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
