import db from "@/db";
import { UsersTable } from "@/db/schema/user.schema";
import type { AppRouteHandler } from "@/lib/types";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import type { CreateRoute } from "./routes";

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const reqData = c.req.valid("json");

  const user = await db.query.UsersTable.findFirst({
    where: (fields, operators) =>
      operators.eq(fields?.walletAddress, reqData?.walletAddress),
  });

  if (!!user) {
    return c.json(
      {
        message: "User retrieved successfully",
        status: true,
        data: user,
      },
      HttpStatusCodes.OK
    );
  }

  const [data] = await db.insert(UsersTable).values(reqData).returning();

  return c.json(
    {
      message: "User created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};
