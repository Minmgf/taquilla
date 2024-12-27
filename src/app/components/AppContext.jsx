'use client'
import { SessionProvider } from "next-auth/react";
import { createContext, useEffect, useState, react } from "react";
import toast from "react-hot-toast";

export const TaquillaContext = createContext({});

export function price(coverPrice){
    let price = coverProduct.basePrice;
    return price;
}

const AppContext = () => {
    return (
        <div>

        </div>
    )
}

export default AppContext
