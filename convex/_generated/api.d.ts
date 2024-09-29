/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as channels from "../channels.js";
import type * as conversation from "../conversation.js";
import type * as http from "../http.js";
import type * as huddle from "../huddle.js";
import type * as members from "../members.js";
import type * as messages from "../messages.js";
import type * as reactions from "../reactions.js";
import type * as storage from "../storage.js";
import type * as user from "../user.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  channels: typeof channels;
  conversation: typeof conversation;
  http: typeof http;
  huddle: typeof huddle;
  members: typeof members;
  messages: typeof messages;
  reactions: typeof reactions;
  storage: typeof storage;
  user: typeof user;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
