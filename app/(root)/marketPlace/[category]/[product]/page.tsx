// app/(root)/marketPlace/[category]/[product]/page.tsx
import { use } from "react";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";

interface ProductPageProps {
  params: Promise<{
    category: string;
    product: Id<"products">; // or string if using slugs
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { product } = use(params); // ✅ unwrap the Promise

  const productData = use(
    fetchQuery(api.listProducts.getProductById, { id: product })
  );

  if (!productData) return <div>Product not found.</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{productData.name}</h1>
      <img
        src={productData.imageUrl}
        alt={productData.name}
        className="w-64 h-64 object-cover mb-4"
      />
      <p className="text-xl text-gray-600">${productData.price.toFixed(2)}</p>
      <p className="mt-4">{productData.description}</p>
    </div>
  );
}
