import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation((ctx) =>
  ctx.storage.generateUploadUrl()
);
