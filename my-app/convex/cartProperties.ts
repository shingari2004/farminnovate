import { mutation ,query } from "./_generated/server";
import { v } from "convex/values";

export const addToCart = mutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, { userId, productId, quantity = 1 }) => {
    const existing = await ctx.db
      .query("cart_items")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), productId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + quantity,
      });
    } else {
      await ctx.db.insert("cart_items", {
        userId,
        productId,
        quantity,
      });
    }
  },
});

export const updateQuantity = mutation({
  args: {
    cartItemId: v.id("cart_items"),
    quantity: v.number(),
  },
  handler: async (ctx, { cartItemId, quantity }) => {
    await ctx.db.patch(cartItemId, { quantity });
  },
});

export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cart_items"),
  },
  handler: async (ctx, { cartItemId }) => {
    await ctx.db.delete(cartItemId);
  },
});

export const getCart = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const cartItems = await ctx.db
      .query("cart_items")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const products = await Promise.all(
      cartItems.map((item) => ctx.db.get(item.productId))
    );

    return cartItems.map((item, index) => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      product: products[index],
    }));
  },
});

export const getTotal = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    const cartItems = await ctx.db
      .query('cart_items')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();

    let total = 0;

    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (!product || typeof product.price !== 'number') continue;

      total += item.quantity * product.price;
    }

    return total;
  },
});

