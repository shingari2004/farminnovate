"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import BillingForm from "@/components/BillingForm";
import CartItems from "@/components/CartItems";
import { useState } from "react";
import Script from "next/script";

// Define proper types for Razorpay
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// API Response type
interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
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
    // Validation checks
    if (!totalValue || totalValue <= 0) {
      alert("Invalid amount. Please check your cart.");
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("Razorpay key not found in environment variables");
      alert("Payment configuration error. Please try again later.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch("../checkout/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: totalValue }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CreateOrderResponse = await response.json();

      if (!data.orderId) {
        throw new Error("Order ID not received from server");
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalValue * 100, // Convert to paise
        currency: "INR",
        name: user?.fullName || "Guest User",
        description: "Payment for cart items",
        order_id: data.orderId,
        handler: function (response: RazorpayResponse) {
          console.log("Payment successful", response);
          
          // Here you can handle successful payment
          // For example, verify payment on your backend
          verifyPayment(response);
        },
        prefill: {
          name: user?.fullName ?? "",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
        },
        theme: {
          color: "#006045",
        },
      };

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please refresh the page.");
      }

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      
    } catch (error) {
      console.error("Payment failed", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to verify payment (you should implement this)
  const verifyPayment = async (response: RazorpayResponse) => {
    try {
      const verificationResponse = await fetch("../checkout/api/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      if (verificationResponse.ok) {
        alert("Payment verified successfully!");
        // Redirect to success page or update UI
      } else {
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="relative max-w-full m-15">
        <p>Please log in to continue with checkout.</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-full m-15">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="flex justify-center gap-10">
        <BillingForm />
        <div className="flex flex-col">
          {cartItems ? <CartItems /> : <p>Loading cart...</p>}
          <button
            className={`mt-6 w-full py-3 rounded-md transition-colors ${
              isProcessing || !totalValue || totalValue <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
            onClick={handlePayment}
            disabled={isProcessing || !totalValue || totalValue <= 0}
          >
            {isProcessing
              ? "Processing...."
              : `Pay Amount: ₹${totalValue || 0}`}
          </button>
        </div>
      </div>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
        onError={(e) => {
          console.error("Failed to load Razorpay script:", e);
        }}
      />
    </div>
  );
}