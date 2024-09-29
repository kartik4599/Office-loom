import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

const getMember = (
  ctx: QueryCtx,
  userId: Id<"users">,
  workspaceId: Id<"workspaces">
) =>
  ctx.db
    .query("members")
    .withIndex("by_workspace_id_and_user_id", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => ctx.db.get(userId);

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) =>
  ctx.db.get(memberId);

export const create = mutation({
  args: { workspaceId: v.id("workspaces"), membersId: v.id("members") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await getMember(ctx, userId, args.workspaceId);
    if (!member) throw new Error("Unauthorized");

    const huddleId = await ctx.db.insert("huddle", {
      status: "waiting",
      workspaceId: args.workspaceId,
      createdMemberId: member._id,
      receiverMemberId: args.membersId,
    });

    return huddleId;
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const member = await getMember(ctx, userId, args.workspaceId);
    if (!member) throw new Error("Unauthorized");

    const huddle = await ctx.db
      .query("huddle")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("createdMemberId"), member._id),
          q.eq(q.field("receiverMemberId"), member._id)
        )
      )
      .unique();
    if (!huddle) return null;
    if (huddle?.createdMemberId === member._id) {
      const receiverMember = await populateMember(ctx, huddle.receiverMemberId);
      if (!receiverMember) return null;

      const receiverUser = await populateUser(ctx, receiverMember?.userId);
      if (!receiverUser) return null;

      return {
        hiddleId: huddle._id,
        isCalling: true,
        status: huddle.status,
        data: { ...receiverMember, user: receiverUser },
      };
    }

    const createdMember = await populateMember(ctx, huddle.createdMemberId);
    if (!createdMember) return null;

    const createdUser = await populateUser(ctx, createdMember.userId);
    if (!createdUser) return null;

    return {
      hiddleId: huddle._id,
      isCalling: false,
      status: huddle.status,
      data: { ...createdMember, user: createdUser },
    };
  },
});

export const accept = mutation({
  args: { id: v.id("huddle") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const huddle = await ctx.db.get(args.id);
    if (!huddle) throw new Error("Not found");

    const member = await getMember(ctx, userId, huddle.workspaceId);
    if (!member) throw new Error("Unauthorized");

    if (
      huddle.receiverMemberId !== member._id &&
      huddle.createdMemberId !== member._id
    ) {
      if (!huddle) throw new Error("Not found");
    }

    return await ctx.db.patch(huddle._id, { status: "accepted" });
  },
});

export const remove = mutation({
  args: { id: v.id("huddle") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const huddle = await ctx.db.get(args.id);
    if (!huddle) throw new Error("Not found");

    const member = await getMember(ctx, userId, huddle.workspaceId);
    if (!member) throw new Error("Unauthorized");

    if (
      huddle.receiverMemberId !== member._id &&
      huddle.createdMemberId !== member._id
    ) {
      if (!huddle) throw new Error("Not found");
    }

    return await ctx.db.delete(huddle._id);
  },
});
