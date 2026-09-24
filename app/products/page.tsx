import { Suspense } from "react";
import ProductsPage from "../../components/products/ProductsPage";

export default function Products() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Loading products...
            </div>
        }>
            <ProductsPage />
        </Suspense>
    );
}