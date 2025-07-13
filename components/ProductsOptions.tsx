import React from "react";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { useState,useEffect} from "react";
import { useQuery , useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {  X } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

type ProductsOptionsProps = {
  productId: Id<"products">;
  userId: Id<"users">;
};

const ProductsOptions = ({ userId, productId }: ProductsOptionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const addToCart = useMutation(api.cartProperties.addToCart);
  const addToWishlist = useMutation(api.wishlistProperties.addToWishList);
  const product = useQuery(api.listProducts.getProductById , { id: productId })

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Clean up on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="relative my-3 w-full ">
      <div className="flex w-40 gap-3 justify-center text-white">
        <div className="relative  w-10 h-10 button-bg rounded-3xl ">
          <div className="relative group/icon flex flex-col items-center">
            <span className="absolute w-10 h-fit -top-8 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300">
              Add to Cart
            </span>
            <ShoppingBag
              onClick={() => addToCart({ userId, productId, quantity: 1 })}
              className="relative top-2 hover:cursor-pointer"
            />
          </div>
        </div>
        <div className="relative w-10 h-10 button-bg rounded-3xl hover:cursor-pointer">
          <div className="relative group/icon flex flex-col items-center">
            <span className="absolute w-10 h-fit -top-8 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300">
              view more
            </span>
            <Eye className="relative top-2" onClick={() => setIsOpen(true)} />
            {isOpen && (
              <div className="fixed inset-0 moreInfo flex justify-center items-center z-50">
                <div className={`relative my-20 w-275 h-130 bg-white rounded shadow-lg p-10 transform transition-all duration-300 ease-out translate-y-[-20px] opacity-0 animate-slideDown`}>
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-2 -right-2 text-white hover:text-red-500 cursor-pointer text-xl font-bold "
                  >
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-2xl button-bg ">
                      <X />
                    </div>
                  </button>
                  <div className="relative flex w-full h-full items-start justify-around ">
                    <div>
                      <img src="/icons/market/product1.png" alt="" className="relative w-100 h-100 bg-neutral-100" />
                    </div>
                    <div className="relative w-1/2 h-full bg-amber-300">
                      <h1>{product?.name}</h1>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <h2 className="text-xl font-semibold mb-4">
                    This is a Modal
                  </h2>
                  <p className="text-gray-700">
                    You can put any content here. Click the × to close.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative w-10 h-10 button-bg rounded-3xl hover:cursor-pointer ">
          <div className="relative group/icon flex flex-col items-center">
            <span className="absolute -top-8 text-xs bg-black text-white px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300">
              add to wishlist
            </span>
            <Heart
              onClick={() => addToWishlist({ userId, productId })}
              className="relative top-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsOptions;
