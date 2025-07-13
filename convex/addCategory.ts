// convex/addCategory.ts
import { mutation , query} from "./_generated/server";
import { v } from "convex/values";

export const addCategory = mutation({
  args: {
    categoryId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    productCount:v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", {
      name: args.name,
      description: args.description,
      productCount:args.productCount
    });
  },
});

export const getCategories = query(async ({ db }) => {
  return await db.query("categories").collect();
});

