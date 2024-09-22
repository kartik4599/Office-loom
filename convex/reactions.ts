import { v } from "convex/values";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) =>
  ctx.db
    .query("members")
    .withIndex("by_workspace_id_and_user_id", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();

export const toggle = mutation({
  args: { messageId: v.id("messages"), value: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const message = await ctx.db.get(args.messageId);
    if (!message) return null;

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member) return null;

    const exisitingReaction = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), message._id),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();

    if (exisitingReaction) {
      await ctx.db.delete(exisitingReaction._id);
      return exisitingReaction._id;
    }

    return await ctx.db.insert("reactions", {
      memberId: member._id,
      value: args.value,
      workspaceId: message.workspaceId,
      messageId: message._id,
    });
  },
});
