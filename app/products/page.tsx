"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProductsPage (){
    return(
        <ProtectedRoute>
            <main>
                <h1>Products</h1>
            </main>
        </ProtectedRoute>
    )
}