"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getProductById, Product, deleteProduct, updateProduct } from "@/api/products";
import { applyOverridesToSingle, recordEditedProduct, recordDeletedProduct, getLocalProductById } from "@/lib/productOverrides";
import image2 from "../../assets/image2.png"

const ProductDetailsPage = () => {
    const params = useParams();
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // new


    const [editForm, setEditForm] = useState({
        title: "",
        price: 0,
        stock: 0,
        description: "",
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!product) return;

        setEditForm({
            title: product.title,
            price: product.price,
            stock: product.stock,
            description: product.description,
        });
    }, [product]);


    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editForm.title.trim()) {
            setError("Title is required.");
            return;
        }
        if (editForm.price < 0) {
            setError("Price cannot be negative.");
            return;
        }
        if (editForm.stock < 0) {
            setError("Stock cannot be negative.");
            return;
        }

        const id = Number(params.id);
        const isLocalOnly = !!getLocalProductById(id);

        try {
            setIsSaving(true);
            setError("");

            let updatedProduct: Product;

            if (isLocalOnly) {
                updatedProduct = { ...(product as Product), ...editForm };
                recordEditedProduct(id, editForm);
            } else {
                updatedProduct = await updateProduct(id, editForm);
                recordEditedProduct(id, editForm);
            }

            setProduct((currentProduct) =>
                currentProduct ? { ...currentProduct, ...editForm } : updatedProduct
            );

            setIsEditing(false);
        } catch {
            setError("Failed to update product.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
      
        const id = Number(params.id);
        const isLocalOnly = !!getLocalProductById(id);

        try {
            setIsDeleting(true);
            setError("");

            if (!isLocalOnly) {
                await deleteProduct(id);
            }

            recordDeletedProduct(id);

            router.push("/products");
        } catch {
            setError("Failed to delete product.");
        } finally {
            setIsDeleting(false);
        }
    };


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

                const localProduct = getLocalProductById(id);

                if (localProduct) {
                    setProduct(localProduct);
                    return;
                }


                const data = await getProductById(id);

                const resolved = applyOverridesToSingle(data);

                if (!resolved) {
                    setError("Product not found.");
                    return;
                }

                setProduct(resolved);
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
                    {showDeleteConfirm && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-[400px] rounded-md bg-white p-6 text-black">
                                <p>Are you sure you want to delete this product?</p>

                                <div className="mt-6 flex gap-4">
                                    <button
                                        className="w-full rounded-md bg-red-400 py-3"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </button>
                                    <button
                                        className="w-full rounded-md border py-3"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="m-8 flex gap-3">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="rounded bg-yellow-500 px-5 py-2 text-black"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            disabled={isDeleting}
                            className="rounded bg-red-600 px-5 py-2 text-white disabled:opacity-50"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                    {!isLoading && !error && product && (
                        <div className="grid gap-10 md:grid-cols-2">

                            {isEditing && product && (
                                <form
                                    onSubmit={handleUpdate}
                                    className="mt-8 space-y-4 rounded-lg border border-gray-700 p-6"
                                >
                                    <div>
                                        <label className="mb-1 block">Title</label>

                                        <input
                                            value={editForm.title}
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    title: event.target.value,
                                                })
                                            }
                                            className="w-full rounded bg-white px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block">Price</label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={editForm.price}
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    price: Number(event.target.value),
                                                })
                                            }
                                            className="w-full rounded bg-white px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block">Stock</label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={editForm.stock}
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    stock: Number(event.target.value),
                                                })
                                            }
                                            className="w-full rounded bg-white px-3 py-2 text-black"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block">Description</label>

                                        <textarea
                                            value={editForm.description}
                                            onChange={(event) =>
                                                setEditForm({
                                                    ...editForm,
                                                    description: event.target.value,
                                                })
                                            }
                                            className="w-full rounded bg-white px-3 py-2 text-black"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="rounded bg-yellow-500 px-5 py-2 text-black disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </form>
                            )}
                            <div>
                                <img
                                    src={product?.images?.[0] || image2.src}
                                    alt={product?.title}
                                    className="w-full rounded-lg bg-white object-contain"
                                />
                            </div>

                            <div className="font-mono">
                                <h1 className="mb-4 text-4xl font-semibold">
                                    {product?.title}
                                </h1>

                                <p className="mb-4 text-gray-400">
                                    {product?.description}
                                </p>

                                <div className="mb-2 text-3xl text-yellow-500">
                                    ${product?.price}
                                </div>


                                <div className="mt-0">
                                    <h2 className="mb-4 text-2xl font-semibold">
                                        Reviews
                                    </h2>

                                    <div className="space-y-4">
                                        {product?.reviews?.map((review, index) => (
                                            <div
                                                key={`${review.reviewerEmail}-${index}`}
                                                className="rounded-lg border border-gray-700 p-4"
                                            >
                                                <div className="flex justify-between">
                                                    <span>{review.reviewerName}</span>
                                                    <span>{review.rating}/5</span>
                                                </div>

                                                <p className="mt-2 text-gray-400">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
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