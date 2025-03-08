import db from "@/db";
import { TokensTable } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import type {
  CreateRoute,
  ListFavouritesRoute,
  ListOverviewRoute,
  ListUserCreatedTokensRoute,
} from "./routes";

export const listFavourites: AppRouteHandler<ListFavouritesRoute> = async (
  c
) => {
  const { slug } = c.req.valid("param");

  const data = await db.query.UserFavouritesTokensTable.findMany({
    where: (fields, operators) => operators.eq(fields?.userId, slug),
  });

  // if (data?.length < 1) {
  //   return c.json(
  //     {
  //       message: "Not found.",
  //       status: false,
  //     },
  //     HttpStatusCodes.NOT_FOUND
  //   );
  // }

  return c.json(
    {
      message: "Favourites retrieved successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const listUserCreatedToken: AppRouteHandler<
  ListUserCreatedTokensRoute
> = async (c) => {
  const { slug } = c.req.valid("param");

  const data = await db.query.TokensTable.findMany({
    where: (fields, operators) => operators.eq(fields?.userId, slug),
  });

  // if (data?.length < 1) {
  //   return c.json(
  //     {
  //       message: "Not found.",
  //       status: false,
  //     },
  //     HttpStatusCodes.NOT_FOUND
  //   );
  // }

  return c.json(
    {
      message: "User created tokens retrieved successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const listOverview: AppRouteHandler<ListOverviewRoute> = async (c) => {
  const data = await db.query.OverviewTokensTable.findMany();

  return c.json(
    {
      message: "Overview retrieved successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const reqData = c.req.valid("json");

  const user = await db.query.UsersTable.findFirst({
    where: (fields, operators) =>
      operators.eq(fields?.walletAddress, reqData?.userId),
  });

  if (!user) {
    return c.json(
      {
        message: "Not found.",
        status: false,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [data] = await db.insert(TokensTable).values(reqData).returning();

  return c.json(
    {
      message: "Task created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};
