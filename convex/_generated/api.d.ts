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
import type * as addCategory from "../addCategory.js";
import type * as cartProperties from "../cartProperties.js";
import type * as http from "../http.js";
import type * as listProducts from "../listProducts.js";
import type * as users from "../users.js";
import type * as wishlistProperties from "../wishlistProperties.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addCategory: typeof addCategory;
  cartProperties: typeof cartProperties;
  http: typeof http;
  listProducts: typeof listProducts;
  users: typeof users;
  wishlistProperties: typeof wishlistProperties;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
