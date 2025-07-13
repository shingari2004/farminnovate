// convex/functions/listProducts.ts
import { query , mutation } from "./_generated/server";
import { v } from "convex/values";

export const listProducts = query({
  args: {
    skip: v.optional(v.number()), // for pagination
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("products")
      .order("desc")
      .take(args.limit ?? 75);
     // defaults to 75
     for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  },
});

export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, { id }) => {
    const product = await ctx.db.get(id);
    if (!product) throw new Error("Product not found");
    return product;
  },
});


export const backfillProductCounts = mutation({
  handler: async (ctx) => {
    // 1. Collect all products
    const allProducts = await ctx.db.query("products").collect();

    // 2. Count products by categoryId
    const counts: Record<string, number> = {};
    for (const product of allProducts) {
      const id = product.categoryId.toString();
      counts[id] = (counts[id] ?? 0) + 1;
    }

    // 3. Update each category with its productCount
    const allCategories = await ctx.db.query("categories").collect();

    for (const category of allCategories) {
      const count = counts[category._id.toString()] ?? 0;
      await ctx.db.patch(category._id, {
        productCount: count,
      });
    }

    return { updated: Object.keys(counts).length };
  },
});

export const getProductsByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_categoryId", (q) => q.eq("categoryId", categoryId))
      .collect();
  },
});