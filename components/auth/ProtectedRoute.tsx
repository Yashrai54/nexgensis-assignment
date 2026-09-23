"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const router = useRouter()

    const [isChecking, setIsChecking] = useState(false)

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken")
        const refreshToken = localStorage.getItem("refreshToken")

        if (!accessToken || !refreshToken) {
            router.replace("/login");
            return;
        }
            setIsChecking(false);

    },[router])

    if(isChecking){
        return(
             <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
        )
    }
      return children;

}

export default ProtectedRoute;