import { mutation , query } from "./_generated/server";
import { v } from "convex/values";

export const addToWishList = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, { userId, productId }) => {
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();

    if (existing) {
      return;
    } else {
      await ctx.db.insert("wishlist", {
        userId,
        productId,
      });
    }
  },
});

export const getWishlist = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    // Get all wishlist items for the user
    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Fetch each product linked to the wishlist items
    const products = await Promise.all(
      wishlistItems.map((item) => ctx.db.get(item.productId))
    );

    // Return both wishlist item info and product data
    return wishlistItems.map((item, i) => ({
      ...item,
      product: products[i],
    }));
  },
});

export const removeFromWishlist = mutation({
  args: {
    wishlistId: v.id("wishlist"),
  },
  handler: async (ctx, { wishlistId }) => {
    await ctx.db.delete(wishlistId);
  },
});