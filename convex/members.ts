import { v } from "convex/values";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { query, QueryCtx } from "./_generated/server";

const populateUser = (ctx: QueryCtx, id: Id<"users">) => ctx.db.get(id);

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) return [];

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const members: { member: Doc<"members">; user: Doc<"users"> }[] = [];
    await Promise.all(
      data.map(async (member) => {
        const user = await populateUser(ctx, userId);
        if (user) members.push({ member, user });
      })
    );

    return members;
  },
});

export const current = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) return null;

    return member;
  },
});
