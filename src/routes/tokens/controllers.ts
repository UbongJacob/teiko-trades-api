import db from "@/db";
import {
  TokenPriceTable,
  TokensTable,
  UserFavouritesTokensTable,
  type IinsertPriceToken,
} from "@/db/schema";
import type { AppRouteHandler } from "@/lib/types";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import type {
  CreateRoute,
  GetOneRoute,
  GetTokenChartDataRoute,
  GetTokenPriceRoute,
  ListFavouritesRoute,
  ListOverviewRoute,
  ListRoute,
  ListUserCreatedTokensRoute,
  PatchRoute,
  ToggleFavouriteRoute,
} from "./routes";
import { and, eq } from "drizzle-orm";
import { cvToValue, fetchCallReadOnlyFunction } from "@stacks/transactions";

export const listFavourites: AppRouteHandler<ListFavouritesRoute> = async (
  c
) => {
  const { slug } = c.req.valid("param");

  const data = await db.query.UserFavouritesTokensTable.findMany({
    where: (fields, operators) => operators.eq(fields?.userId, slug),
    with: {
      token: {
        columns: {
          ticker: true,
          dexName: true,
        },
      },
    },
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

export const getTokenChartData: AppRouteHandler<
  GetTokenChartDataRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  const data = await db.query.TokenPriceTable.findMany({
    where: (fields, operators) => operators.eq(fields?.tokenId, id),
    columns: {
      tokenId: false,
    },
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
      message: "Price history retrieved successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};

export const getTokenPrice: AppRouteHandler<GetTokenPriceRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const token = await db.query.TokensTable.findFirst({
    where: (fields, operators) => operators.eq(fields?.id, id),
  });

  if (!token) {
    return c.json(
      {
        message: "Token not found.",
        status: false,
        data: null,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  try {
    const tokens = [token];

    const tokenWithPrices: IinsertPriceToken[] = [];

    const promises = tokens.map(async ({ dexName, userId, id }) => {
      if (!!dexName && !!userId && !!id) {
        try {
          const response = await fetchCallReadOnlyFunction({
            contractAddress: userId,
            contractName: dexName,
            functionName: "get-price",
            functionArgs: [],
            network: "testnet",
            senderAddress: userId,
          });

          const price = cvToValue(response)?.value ?? "";

          tokenWithPrices.push({ price, tokenId: id });
        } catch (error) {
          console.log("A fetch error occurred");
        }
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    if (tokenWithPrices.length > 0) {
      await db.insert(TokenPriceTable).values(tokenWithPrices);
    }
  } catch (error) {
    console.log("An error occurred", error);
  }

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
      message: "Price history retrieved successfully",
      status: false,
      data: null,
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
