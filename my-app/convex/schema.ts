// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    productCount: v.optional(v.number()),
  }),

  products: defineTable({
    name: v.string(),
    price: v.number(),
    categoryId: v.id("categories"), // Reference to the category
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
  }).index("by_categoryId", ["categoryId"]),
  
  cart_items: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user", ["userId"]),
  wishlist: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  }).index("by_user", ["userId"]),
});

export default schema;
