import db from "@/db";
import { coin, price, tokenTable, userTable } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { fetchCallReadOnlyFunction } from "@stacks/transactions";
import type {
  CreateRoute,
  CreateTokenRoute,
  CreateUserRoute,
  listAllPricesRoute,
  ListRoute,
  ListTokenRoute,
} from "./routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const data = await db.query.coin.findMany({
    orderBy: (fields, operators) => operators.desc(fields.createdAt),
  });

  return c.json({
    message: "List gootten successfully",
    status: true,
    data,
  });
};

const create: AppRouteHandler<CreateRoute> = async (c) => {
  const reqData = c.req.valid("json");

  const [data] = await db.insert(coin).values(reqData).returning();

  return c.json(
    {
      message: "Coin created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const getPrice = async () => {
  const response = await fetchCallReadOnlyFunction({
    contractAddress: "ST2SHP0RSX5ST9HTKJM4JF6SGQ686P4GJGF2XHHTX",
    contractName: "ronaldo-test-token-7-dex",
    functionName: "get-price",
    functionArgs: [],
    network: "testnet",
    senderAddress: "ST2SHP0RSX5ST9HTKJM4JF6SGQ686P4GJGF2XHHTX",
  });

  // @ts-ignore
  const gottenPrice = response?.value?.value ?? "0";
  const [data] = await db
    .insert(price)
    .values({ price: gottenPrice })
    .returning();

  console.log("Price gotten successfully,", JSON.stringify(data, null));

  return data;
};

const saveCoinPrice: AppRouteHandler<any> = async (c) => {
  const data = getPrice();

  return c.json(
    {
      message: "",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const listAllPrices: AppRouteHandler<listAllPricesRoute> = async (c) => {
  const data = await db.query.price.findMany({
    orderBy: (fields, operators) => operators.desc(fields.createdAt),
  });

  return c.json({
    message: "Prices gootten successfully",
    status: true,
    data,
  });
};

const createToken: AppRouteHandler<CreateTokenRoute> = async (c) => {
  const reqData = c.req.valid("json");

  const [data] = await db.insert(tokenTable).values(reqData).returning();

  return c.json(
    {
      message: "Token created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const listAllTokens: AppRouteHandler<ListTokenRoute> = async (c) => {
  const data = await db.query.tokenTable.findMany({
    orderBy: (fields, operators) => operators.desc(fields.createdAt),
  });

  return c.json({
    message: "tokens gootten successfully",
    status: true,
    data,
  });
};

const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const reqData = c.req.valid("json");

  const [data] = await db.insert(userTable).values(reqData).returning();

  return c.json(
    {
      message: "User created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const listAllTokens: AppRouteHandler<ListUserRoute> = async (c) => {
  const data = await db.query.userTable.findMany({
    orderBy: (fields, operators) => operators.desc(fields.createdAt),
  });

  return c.json({
    message: "users gootten successfully",
    status: true,
    data,
  });
};

export default {
  list,
  listAllPrices,
  create,
  saveCoinPrice,
  createToken,
  listAllTokens,
};
