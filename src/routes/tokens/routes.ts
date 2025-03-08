import { createRoute, z } from "@hono/zod-openapi";

import {
  insertTokensSchema,
  patchTokensSchema,
  selectFavouritesTokensSchema,
  selectOverviewTokensSchema,
  selectTokensSchema,
} from "@/db/schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { jsonContentRequired } from "@/stoker/openapi/helpers";
import {
  customJsonContent,
  customJsonErrorContent,
  customMessageContent,
  oneOfErrorSchema,
} from "@/stoker/openapi/helpers/json-content";
import { IdParamsSchema, SlugParamsSchema } from "@/stoker/openapi/schemas";

const tags = ["Tokens"];

export const list = createRoute({
  path: "/tokens",
  method: "get",
  request: {
    params: SlugParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectTokensSchema),
      "The list of all tokens"
    ),
  },
});

export const listFavourites = createRoute({
  path: "/tokens/favourites/{slug}",
  method: "get",
  request: {
    params: SlugParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectFavouritesTokensSchema),
      "The list of user favourites"
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      SlugParamsSchema,
      "Invalid slug error."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(
      false,
      "Favourites not found."
    ),
  },
});

export const listUserCreatedTokens = createRoute({
  path: "/tokens/user-created/{slug}",
  method: "get",
  request: {
    params: SlugParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectTokensSchema),
      "The list of user created tokens"
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      SlugParamsSchema,
      "Invalid slug error."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(
      false,
      "User created tokens not found."
    ),
  },
});

export const listOverview = createRoute({
  path: "/tokens/overview",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectOverviewTokensSchema),
      "The list of overview tokens"
    ),
  },
});

export const create = createRoute({
  path: "/tokens",
  method: "post",
  request: {
    body: jsonContentRequired(insertTokensSchema, ""),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTokensSchema,
      "The created token."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      insertTokensSchema,
      "The validation error(s)."
    ),
    [HttpStatusCodes.NOT_FOUND]: customMessageContent(false, "User not found."),
  },
});

export const patch = createRoute({
  path: "/tokens/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchTokensSchema, ""),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTokensSchema,
      "The updated token."
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: oneOfErrorSchema(
      [IdParamsSchema, patchTokensSchema],
      "The validation error(s)."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(
      false,
      "Token not found."
    ),
  },
});

export const getOne = createRoute({
  path: "/tokens/single/{slug}",
  method: "get",
  request: {
    params: SlugParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTokensSchema,
      "The requested token"
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      SlugParamsSchema,
      "Invalid Id error."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(
      false,
      "Token not found."
    ),
  },
});

export type ListRoute = typeof list;
export type ListOverviewRoute = typeof listOverview;
export type CreateRoute = typeof create;
export type ListFavouritesRoute = typeof listFavourites;
export type ListUserCreatedTokensRoute = typeof listUserCreatedTokens;
export type PatchRoute = typeof patch;
export type GetOneRoute = typeof getOne;
