"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import BillingForm from "@/components/BillingForm";
import CartItems from "@/components/CartItems";
import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser(); // Clerk user object
  const clerkId = user?.id;
  const convexUser = useQuery(
    api.users.getUserById,
    clerkId ? { clerkId } : "skip"
  );
  const userId = convexUser?._id;
  const cartItems = useQuery(
    api.cartProperties.getCart,
    userId ? { userId } : "skip"
  );
  const totalValue = useQuery(
    api.cartProperties.getTotal,
    userId ? { userId } : "skip"
  );
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("../checkout/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: totalValue ?? 0 }),
      });
      const data = await response.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: (totalValue ?? 0) * 100,
        currency: "INR",
        name: user?.fullName,
        description: "test",
        order_id: data.orderId,
        handler: function (response: string) {
          console.log("Payment successful", response);
        },
        prefill: {
          name: user?.fullName ?? "",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
        },
        theme: {
          color: "#006045",
        },
      };
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative max-w-full m-15">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex justify-center gap-10">
        <BillingForm />
        <div className="flex flex-col">
          {cartItems ? <CartItems /> : <p>Loading cart...</p>}
          <button
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing.... "
              : "Pay Amount : " + totalValue + " INR"}
          </button>
        </div>
      </div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </div>
    
  );
}
