import { createRoute, z } from "@hono/zod-openapi";

import {
  insertCoinSchema,
  insertTokenSchema,
  insertUserSchema,
  selectCoinsSchema,
  selectPriceSchema,
  selectTokenSchema,
  selectUserSchema,
} from "@/db/schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { jsonContentRequired } from "@/stoker/openapi/helpers";
import {
  customJsonContent,
  customJsonErrorContent,
} from "@/stoker/openapi/helpers/json-content";
import { createErrorSchema } from "@/stoker/openapi/schemas";

const tags = ["coins"];
const tokenTags = ["token"];
const usersTags = ["users"];

const list = createRoute({
  path: "/coins",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectCoinsSchema),
      "The list of coins"
    ),
  },
});

const create = createRoute({
  path: "/coins",
  method: "post",
  request: {
    body: jsonContentRequired(insertCoinSchema, "The coin to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectCoinsSchema,
      "The created coin."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      createErrorSchema(insertCoinSchema),
      "The validation error(s)."
    ),
  },
});

const saveCoinPrice = createRoute({
  path: "/coins/price",
  method: "post",
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectPriceSchema,
      "The added price."
    ),
  },
});

const listAllPrices = createRoute({
  path: "/coins/prices",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectPriceSchema),
      "Price list"
    ),
  },
});

const createToken = createRoute({
  path: "/token",
  method: "post",
  request: {
    body: jsonContentRequired(insertTokenSchema, "The token to create"),
  },
  tags: tokenTags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTokenSchema,
      "The created coin."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      createErrorSchema(insertTokenSchema),
      "The validation error(s)."
    ),
  },
});

const listToken = createRoute({
  path: "/token",
  method: "get",
  tags: tokenTags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectTokenSchema),
      "The list of tokens"
    ),
  },
});

const createToken = createRoute({
  path: "/token",
  method: "post",
  request: {
    body: jsonContentRequired(insertTokenSchema, "The token to create"),
  },
  tags: tokenTags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTokenSchema,
      "The created user."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      createErrorSchema(insertTokenSchema),
      "The validation error(s)."
    ),
  },
});

const listUsers = createRoute({
  path: "/users",
  method: "get",
  tags: usersTags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectUserSchema),
      "The list of users"
    ),
  },
});

const createUser = createRoute({
  path: "/users",
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema, "The user to create"),
  },
  tags: usersTags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTokenSchema,
      "The created user."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      createErrorSchema(insertUserSchema),
      "The validation error(s)."
    ),
  },
});

export default {
  list,
  listAllPrices,
  create,
  saveCoinPrice,
  createToken,
  listToken,
  createUser,
  listUsers,
};

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type SaveCoinPriceRoute = typeof saveCoinPrice;
export type listAllPricesRoute = typeof listAllPrices;
export type CreateTokenRoute = typeof createToken;
export type ListTokenRoute = typeof listToken;
export type CreateUserRoute = typeof createUser;
export type ListUserRoute = typeof listUsers;
