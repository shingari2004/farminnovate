"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs"; // or your auth provider
import FullScreenLoader from "@/components/FullScreenLoader";

// Replace with actual user session/user ID


const CartItems = () => {
  
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

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  if (!cartItems) return <FullScreenLoader />;

  

  return (
    <div className=" mx-auto p-6 bg-white">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
          <div className="col-span-1">Images</div>
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-center">Unit Price</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-center">Total</div>
        </div>

        {/* Items */}
        {cartItems.map((item, index) => (
          <div
            key={item._id}
            className={`grid grid-cols-6 gap-4 p-4 items-center ${index !== cartItems.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div className="col-span-1">
              <img
                src={item.product?.imageUrl}
                className="w-15 h-15 object-cover rounded"
                alt={item.product?.name}
              />
            </div>
            <div className="col-span-1">
              <span className="text-gray-800 font-medium">
                {item.product?.name}
              </span>
            </div>
            <div className="col-span-1 text-center">
              {formatPrice(item.product?.price ?? 0)}
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <div className="flex items-center">
                <span className="px-4 py-2 min-w-[3rem] text-center bg-white border">
                  {item.quantity}
                </span>
              </div>
            </div>
            <div className="col-span-1 text-center font-medium">
              {formatPrice(item.quantity * (item.product?.price ?? 0))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full h-15 border-2 border-neutral-300 mt-5 p-5">
        <div className="">Subtotal:</div>
        <div className="">₹{totalValue}.00</div>
      </div>
      
    </div>
  );
};

export default CartItems;
