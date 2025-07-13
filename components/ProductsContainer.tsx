"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Star } from "lucide-react";
import ProductsOptions from "./ProductsOptions";
import { useUser } from "@clerk/clerk-react";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";
import FullScreenLoader from "./FullScreenLoader";

const PRODUCTS_PER_PAGE = 8;

const ProductsContainer = () => {
  const [page, setPage] = useState(0);
  const { user } = useUser(); // Clerk user object
  const clerkId = user?.id;

  const convexUser = useQuery(
    api.users.getUserById,
    clerkId ? { clerkId } : "skip"
  );

  const products = useQuery(api.listProducts.listProducts, {});
  const categories = useQuery(api.addCategory.getCategories);
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);

  // For fade animation
  const [isFading, setIsFading] = useState(false);

  // Filtered products
  const categoryProducts = useQuery(
    api.listProducts.getProductsByCategory,
    selectedCategory ? { categoryId: selectedCategory } : "skip"
  );

  const allProducts = selectedCategory ? categoryProducts : products;

  const paginatedProducts = (allProducts ?? []).slice(
    page * PRODUCTS_PER_PAGE,
    (page + 1) * PRODUCTS_PER_PAGE
  );

  const totalPages = Math.ceil((allProducts ?? []).length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setIsFading(true);
    const timeout = setTimeout(() => setIsFading(false), 300);
    return () => clearTimeout(timeout);
  }, [selectedCategory, page]);

  if (!allProducts) return <FullScreenLoader/>;

  const convexUserId = convexUser?._id;

  return (
    <div className="relative w-full h-fit px-28 pb-28">
      <div className="relative h-full">
        <div>
          {/* Header */}
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col">
              <div className="relative flex items-center justify-center top-4 w-30 h-8 button-bg2 mb-10 uppercase font-extrabold green-text">
                This Month
              </div>
              <h1 className="text-7xl font-bold header-color">
                Trendy Products
              </h1>
            </div>
            <div>
              <select
                value={selectedCategory ?? "all"}
                className="absolute bottom-0 mb-4 right-0 rounded border px-4 py-2"
                onChange={(e) =>
                  setSelectedCategory(
                    e.target.value === "all"
                      ? null
                      : (e.target.value as Id<"categories">)
                  )
                }
              >
                <option value="all">All Products</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div
            key={selectedCategory ?? "all"}
            className={`relative grid grid-cols-4 gap-8 py-6 transition-opacity duration-300 ${
              isFading ? "opacity-0" : "opacity-100"
            }`}
          >
            {paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="relative flex flex-col items-center text-center"
              >
                <div
                  className="group flex flex-col w-full h-75 justify-between items-center slider-bg"
                  style={{
                    backgroundImage: "url('/icons/pattern.png')",
                    backgroundSize: "cover",
                  }}
                >
                  <Link href={`/marketPlace/${product.categoryId}/${product._id}`}>
                    {product.imageUrl && (
                      <img
                        src=/* {product.imageUrl} */ '/icons/market/product1.png'
                        alt={product.name}
                        className="relative top-15 w-40 h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </Link>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <ProductsOptions
                      userId={convexUserId}
                      productId={product._id}
                    />
                  </div>
                </div>

                <div className="relative w-full py-6 text-left">
                  <h3 className="font-bold text-2xl">{product.name}</h3>
                  <div className="flex items-center gap-1 text-yellow-300 w-32 py-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} />
                    ))}
                  </div>
                  <p className="text-xl font-medium text-gray-500 header-color">
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsContainer;
