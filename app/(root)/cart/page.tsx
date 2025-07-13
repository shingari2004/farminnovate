"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Minus, Plus, X } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs"; // or your auth provider
import FullScreenLoader from "@/components/FullScreenLoader";
import Link from "next/link";

const ShoppingCart = () => {
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

  const updateQuantity = useMutation(api.cartProperties.updateQuantity);
  const removeFromCart = useMutation(api.cartProperties.removeFromCart);

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;

  const handleQuantityChange = (id: Id<"cart_items">, quantity: number) => {
    updateQuantity({ cartItemId: id, quantity });
  };

  const handleRemove = (id: Id<"cart_items">) => {
    removeFromCart({ cartItemId: id });
  };

  if (!cartItems) return <FullScreenLoader />;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
          <div className="col-span-1">Images</div>
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-center">Unit Price</div>
          <div className="col-span-1 text-center">Quantity</div>
          <div className="col-span-1 text-center">Total</div>
          <div className="col-span-1 text-center">Remove</div>
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
                className="w-20 h-20 object-cover rounded"
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
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  className="p-2 hover:bg-gray-100 rounded-l-lg"
                >
                  <Minus
                    size={16}
                    className={
                      item.quantity <= 1 ? "text-gray-300" : "text-gray-600"
                    }
                  />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center bg-white border-x border-gray-300">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(item._id, item.quantity + 1)
                  }
                  className="p-2 hover:bg-gray-100 rounded-r-lg"
                >
                  <Plus size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <div className="col-span-1 text-center font-medium">
              {formatPrice(item.quantity * (item.product?.price ?? 0))}
            </div>
            <div className="col-span-1 text-center">
              <button
                onClick={() => handleRemove(item._id)}
                className="p-2 hover:bg-red-50 rounded-lg group"
              >
                <X
                  size={20}
                  className="text-gray-400 group-hover:text-red-500"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 ? (
        <div className="my-6 flex flex-col">
          <div className="flex flex-col relative gap-4 pb-15">
            <input
              type="text"
              placeholder="Coupon Code"
              className="relative w-75 h-15 border-2 border-emerald-600 p-3"
            />
            <button className="relative flex items-center justify-center w-45 h-12 button-bg text-white font-bold rounded-2xl p-4 hover:pointer-cursor">
              APPLY COUPON
            </button>
          </div>
          <div className="flex flex-col ">
            <h1 className="text-2xl font-extrabold pb-5">Cart Totals</h1>
            <div className="relative flex flex-col mb-5 ">
              <div className="flex justify-between w-1/2 h-15 border-x-2 border-t-2 border-neutral-300 p-5">
                <div className="">Subtotal:</div>
                <div className="">
                  {formatPrice(
                    cartItems.reduce(
                      (sum, item) =>
                        sum + (item.product?.price ?? 0) * item.quantity,
                      0
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-between w-1/2 h-15 border-2 border-t-2 border-neutral-300 p-5">
                <div className="">Total:</div>
                <div className="">
                  {formatPrice(
                    cartItems.reduce(
                      (sum, item) =>
                        sum + (item.product?.price ?? 0) * item.quantity,
                      0
                    )
                  )}
                </div>
              </div>
            </div>
            <button className="relative flex items-center justify-center w-fit h-12 button-bg text-white font-bold rounded-2xl p-4 hover:pointer-cursor">
              <Link href="/checkout">PROCEED TO CHECKOUT</Link>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Your cart is empty
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
