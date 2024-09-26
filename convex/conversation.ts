import { v } from "convex/values";
import { auth } from "./auth";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const createOrGet = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    const otherMember = await ctx.db.get(args.memberId);

    if (!otherMember || !currentMember) throw new Error("Member not found");

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) return existingConversation._id;

    return await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!currentMember) return [];

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.eq(q.field("memberOneId"), currentMember._id),
          q.eq(q.field("memberTwoId"), currentMember._id)
        )
      )
      .collect();

    const finalData = (
      await Promise.all(
        conversations.map(async (conversation) => {
          const [message] = await ctx.db
            .query("messages")
            .withIndex("by_conversation_id", (q) =>
              q.eq("conversationId", conversation._id)
            )
            .order("desc")
            .take(1);
          if (!message) return null;

          const memberId =
            conversation.memberOneId === currentMember._id
              ? conversation.memberTwoId
              : conversation.memberOneId;

          const member = (await ctx.db.get(memberId)) as Doc<"members">;
          if (!member) return null;
          const user = (await ctx.db.get(member.userId)) as Doc<"users">;
          if (!user) return null;

          return { member, user, message };
        })
      )
    ).filter(Boolean) as {
      member: Doc<"members">;
      user: Doc<"users">;
      message: Doc<"messages">;
    }[];

    finalData.sort((a, b) => b.message._creationTime - a.message._creationTime);

    return finalData;
  },
});
