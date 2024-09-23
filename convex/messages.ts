import { paginationOptsValidator, Query } from "convex/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => ctx.db.get(userId);

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) =>
  ctx.db.get(memberId);

const populateReaction = async (
  ctx: QueryCtx,
  messageId: Id<"messages">,
  currentMember: Doc<"members">
) => {
  const reactions = await ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();

  let reactionCount: {
    value: string;
    count: number;
    isSelected: boolean;
  }[] = [];
  reactions.forEach((react) => {
    const reactionIndex = reactionCount.findIndex(
      ({ value }) => value === react.value
    );
    const isSelected = react.memberId === currentMember?._id;
    if (reactionIndex === -1) {
      return reactionCount.push({
        value: react.value,
        count: 1,
        isSelected,
      });
    }
    reactionCount[reactionIndex] = {
      ...reactionCount[reactionIndex],
      count: reactionCount[reactionIndex].count + 1,
      isSelected,
    };
  });

  return reactionCount;
};

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_Id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: undefined,
      image: undefined,
      timestamp: undefined,
      name: undefined,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return { count: messages.length, image: undefined, timestamp: 0 };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    name: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
};

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

export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    let conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) throw new Error("Invalid parent message");
      conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_parentMessage_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;
            if (!member || !user) return null;
            const currentMember = await getMember(
              ctx,
              message.workspaceId,
              userId
            );
            if (!currentMember) return null;
            const reactions = await populateReaction(
              ctx,
              message._id,
              currentMember
            );
            const thread = await populateThread(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            return {
              ...message,
              member,
              user,
              reactions,
              thread,
              image,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});

export const getById = query({
  args: { id: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const message = await ctx.db.get(args.id);
    if (!message) return null;

    const member = await populateMember(ctx, message.memberId);
    if (!member) return null;

    const user = await populateUser(ctx, member.userId);
    if (!user) return user;

    const currentMember = await getMember(ctx, message.workspaceId, userId);
    if (!currentMember) return null;

    const image = message.image
      ? await ctx.storage.getUrl(message.image)
      : undefined;

    const reactions = await populateReaction(ctx, message._id, currentMember);

    return { ...message, image, user, member, reactions };
  },
});

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const member = await getMember(ctx, args.workspaceId, userId);
    if (!member) return null;

    let conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) return null;
      conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId,
    });

    return messageId;
  },
});

export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const message = await ctx.db.get(args.id);
    if (!message) return null;

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId) return null;

    await ctx.db.patch(args.id, { body: args.body, updatedAt: Date.now() });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const message = await ctx.db.get(args.id);
    if (!message) return null;

    const member = await getMember(ctx, message.workspaceId, userId);
    if (!member || member._id !== message.memberId) return null;

    const threadMesssage = await ctx.db
      .query("messages")
      .withIndex("by_parent_message_Id", (q) =>
        q.eq("parentMessageId", message._id)
      )
      .collect();

    await Promise.all(
      threadMesssage.map(async ({ _id, image }) => {
        if (image) await ctx.storage.delete(image);
        await ctx.db.delete(_id);
      })
    );
    if (message.image) await ctx.storage.delete(message.image);
    await ctx.db.delete(message._id);

    return message._id;
  },
});
