"use client";

import { Product } from "@/api/products";

interface ProductCardListProps {
    products: Product[];
    total: number;
    limit: number;
    pageIndex: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
}

const ProductCardList = ({
    products,
    total,
    limit,
    pageIndex,
    onPageChange,
    onLimitChange
}: ProductCardListProps) => {
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="block md:hidden flex flex-col gap-4 font-mono">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="rounded-lg border border-gray-200 bg-black p-4"
                >
                    <div className="flex items-center gap-3">
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            className="h-14 w-14 flex-shrink-0 rounded border bg-white object-cover"
                        />

                        <span className="font-medium text-white">
                            {product.title}
                        </span>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm text-white">
                        <dt className="text-gray-400">Category</dt>
                        <dd className="text-right">{product.category}</dd>

                        <dt className="text-gray-400">Price</dt>
                        <dd className="text-right">${product.price}</dd>

                        <dt className="text-gray-400">Rating</dt>
                        <dd className="text-right">{product.rating}</dd>

                        <dt className="text-gray-400">Stock</dt>
                        <dd className="text-right">{product.stock}</dd>
                    </dl>
                </div>
            ))}

            <footer className="flex flex-col gap-4 border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Rows:</span>

                        <select
                            value={limit}
                            onChange={(event) => onLimitChange(Number(event.target.value))}
                            className="rounded border border-gray-600 bg-black px-2 py-1.5 text-white outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <span className="text-sm">
                        Page {pageIndex} of {totalPages}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(pageIndex - 1)}
                        disabled={pageIndex === 1}
                        className="flex-1 rounded bg-yellow-500 px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <button
                        onClick={() => onPageChange(pageIndex + 1)}
                        disabled={pageIndex === totalPages}
                        className="flex-1 rounded bg-yellow-500 px-4 py-2 text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ProductCardList;