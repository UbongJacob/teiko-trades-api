import db from "@/db";
import { TokensTable, UserFavouritesTokensTable } from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import type {
  CreateRoute,
  GetOneRoute,
  ListFavouritesRoute,
  ListOverviewRoute,
  ListRoute,
  ListUserCreatedTokensRoute,
  PatchRoute,
  ToggleFavouriteRoute,
} from "./routes";
import { and, eq } from "drizzle-orm";

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

export const toggleFavourite: AppRouteHandler<ToggleFavouriteRoute> = async (
  c
) => {
  const reqData = c.req.valid("json");

  const user = await db.query.UsersTable.findFirst({
    where: (fields, operators) =>
      operators.eq(fields?.walletAddress, reqData?.userId),
  });

  if (!user) {
    return c.json(
      {
        message: "User Not Found.",
        status: false,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }
  const token = await db.query.TokensTable.findFirst({
    where: (fields, operators) => operators.eq(fields?.id, reqData?.tokenId),
  });

  if (!token) {
    return c.json(
      {
        message: "Token Not Found.",
        status: false,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const favouriteToken = await db.query.UserFavouritesTokensTable.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields?.tokenId, reqData?.tokenId),
        operators.eq(fields?.userId, reqData?.userId)
      ),
  });

  if (favouriteToken) {
    await db
      .delete(UserFavouritesTokensTable)
      .where(
        and(
          eq(UserFavouritesTokensTable?.tokenId, reqData?.tokenId),
          eq(UserFavouritesTokensTable?.userId, reqData?.userId)
        )
      );
    return c.json(
      {
        message: "Favourite removed successfully",
        status: true,
        data: favouriteToken,
      },
      HttpStatusCodes.OK
    );
  } else {
    const [data] = await db
      .insert(UserFavouritesTokensTable)
      .values({ tokenId: token?.id, userId: user?.walletAddress })
      .returning();

    return c.json(
      {
        message: "Favourite added successfully",
        status: true,
        data,
      },
      HttpStatusCodes.OK
    );
  }
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
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const data = await db.query.TokensTable.findMany();

  return c.json(
    {
      message: "All tokens retrieved successfully",
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
      message: "Token created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [data] = await db
    .update(TokensTable)
    .set(updates)
    .where(eq(TokensTable.id, id))
    .returning();

  if (!data) {
    return c.json(
      {
        message: "Token not found.",
        status: false,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      message: "Token updated successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { slug } = c.req.valid("param");

  const task = await db.query.TokensTable.findFirst({
    where: (fields, operators) => operators.eq(fields?.dexName, slug),
  });

  if (!task) {
    return c.json(
      {
        message: "Not found.",
        status: false,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      message: "Token retrieved successfully",
      status: true,
      data: task,
    },
    HttpStatusCodes.OK
  );
};
