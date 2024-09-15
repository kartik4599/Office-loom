import { v } from "convex/values";
import { auth } from "./auth";
import { mutation, query } from "./_generated/server";

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 10)]
  ).join("");

  return code;
};

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) return null;

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: args.name,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    return workspaceId;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_Id", (q) => q.eq("userId", userId))
      .collect();

    const workspaces = await Promise.all(
      members.map(async ({ workspaceId }) => await ctx.db.get(workspaceId))
    );

    return workspaces;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member) return null;

    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: { id: v.id("workspaces"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member || member.role !== "admin") return null;

    await ctx.db.patch(args.id, { name: args.name });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();

    if (!member || member.role !== "admin") return null;

    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);

    await Promise.all(members.map(async ({ _id }) => await ctx.db.delete(_id)));

    await ctx.db.delete(args.id);
    return args.id;
  },
});
