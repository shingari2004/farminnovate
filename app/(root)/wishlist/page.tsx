"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs"; // or your auth provider
import { X } from "lucide-react";
import FullScreenLoader from "@/components/FullScreenLoader";

const Wishlist = () => {
  const { user } = useUser(); // Clerk user object
  const clerkId = user?.id;
  const convexUser = useQuery(
    api.users.getUserById,
    clerkId ? { clerkId } : "skip"
  );
  const userId = convexUser?._id;
  const wishlistItems = useQuery(
    api.wishlistProperties.getWishlist,
    userId ? { userId } : "skip"
  );

  const removeFromWishlist = useMutation(api.wishlistProperties.removeFromWishlist);
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const handleRemove = (id: Id<"wishlist">) => {
    removeFromWishlist({ wishlistId: id });
  };

  if (!wishlistItems) return <FullScreenLoader/>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
          <div className="col-span-1">Images</div>
          <div className="col-span-1">Product</div>
          <div className="col-span-1 text-center">Unit Price</div>
          <div className="col-span-1 text-center">Remove</div>
        </div>

        {/* Items */}
        {wishlistItems.map((item, index) => (
          <div
            key={item._id}
            className={`grid grid-cols-4 gap-4 p-4 items-center ${index !== wishlistItems.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <div className="col-span-1">
              <img
                src={item.product?.imageUrl}
                className="w-24 h-24 object-cover rounded"
                alt={item.product?.name}
              />
            </div>
            <div className="col-span-1">
              <span className="text-gray-800 font-medium">
                {item.product?.name}
              </span>
            </div>
            <div className="col-span-1 text-center">
              {formatPrice(item.product?.price!)}
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

      {wishlistItems.length > 0 ? (
        <div className="mt-6 flex justify-end">
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Your wishlist is empty
        </div>
      )}
    </div>
  );
};

export default Wishlist;
