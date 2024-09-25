import { auth } from "./auth";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const updatePhoto = mutation({
  args: { image: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) return null;

    const url = await ctx.storage.getUrl(args.image);
    if (!url) return null;

    return await ctx.db.patch(userId, { image: url });
  },
});
