import apiClient from "./client";

export const getProducts =async(limit:number,skip:number)=>{
    const response = await apiClient.get("/products",{
        params:{
            limit,
            skip
        }
    })

    return response.data
}