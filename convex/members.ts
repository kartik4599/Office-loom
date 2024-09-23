import { v } from "convex/values";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

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
        const user = await populateUser(ctx, member.userId);
        if (user) members.push({ member, user });
      })
    );

    return members;
  },
});

export const getById = query({
  args: { memberId: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const member = await ctx.db.get(args.memberId);
    if (!member) return null;

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();
    if (!currentMember) return null;

    const user = await populateUser(ctx, member.userId);
    if (!user) return null;

    return { ...member, user };
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

export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();
    if (!currentMember || currentMember.role !== "admin")
      throw new Error("not found");

    await ctx.db.patch(args.id, { role: args.role });

    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("not found");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();
    if (!currentMember) throw new Error("Unauthorized");

    if (member.role === "admin") throw new Error("Admin cannot be removed");
    if (currentMember._id === member._id && currentMember.role === "admin")
      throw new Error("Admin cannot be removed");

    const allData = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", args.id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_Id", (q) => q.eq("memberId", args.id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), args.id),
            q.eq(q.field("memberTwoId"), args.id)
          )
        )
        .collect(),
    ]);

    await Promise.all(
      allData.map(
        async (data) =>
          await Promise.all(
            data.map(async ({ _id }) => await ctx.db.delete(_id))
          )
      )
    );

    await ctx.db.delete(args.id);

    return args.id;
  },
});
