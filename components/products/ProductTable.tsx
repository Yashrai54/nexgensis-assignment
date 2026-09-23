

"use client";

import { Product } from "@/api/products";

interface ProductTableProps {
    products: Product[];
    total: number;
    limit: number;
    pageIndex: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const ProductTable = ({
    products,
    total,
    limit,
    pageIndex,
    onPageChange,
    onLimitChange
}: ProductTableProps) => {
    const totalPages = Math.ceil(total / limit);
    return (
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 font-mono">
            <table className="w-full min-w-[800px] text-left">
                <thead className="bg-yellow-500 text-white">
                    <tr>
                        <th className="px-4 py-3 text-sm font-medium">Product</th>
                        <th className="px-4 py-3 text-sm font-medium">Category</th>
                        <th className="px-4 py-3 text-sm font-medium">Price</th>
                        <th className="px-4 py-3 text-sm font-medium">Rating</th>
                        <th className="px-4 py-3 text-sm font-medium">Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} className="border-t">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="h-12 w-12 rounded object-cover border bg-white"
                                    />

                                    <span className="font-medium">
                                        {product.title}
                                    </span>
                                </div>
                            </td>

                            <td className="px-4 py-3 text-sm text-white">
                                {product.category}
                            </td>

                            <td className="px-4 py-3">
                                ${product.price}
                            </td>

                            <td className="px-4 py-3">
                                {product.rating}
                            </td>

                            <td className="px-4 py-3">
                                {product.stock}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <footer className="flex items-center justify-between border-t border-gray-700 px-4 py-4">
                <div className="flex items-center gap-3 text-white">
                    <span className="text-sm">Rows per page:</span>

                    <select
                        value={limit}
                        onChange={(event) => onLimitChange(Number(event.target.value))}
                        className="rounded border border-gray-600 bg-black px-3 py-2 text-white outline-none"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <span className="text-white">
                    Page {pageIndex} of {totalPages}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(pageIndex - 1)}
                        disabled={pageIndex === 1}
                        className="rounded bg-yellow-500 px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => onPageChange(pageIndex + 1)}
                        disabled={pageIndex === totalPages}
                        className="rounded bg-yellow-500 px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ProductTable;