import db from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import type { CreateRoute, ListRoute } from "./tasks.routes";
import { tasks } from "@/db/schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const tasks = await db.query.tasks.findMany({
    orderBy: (fields, operators) => operators.desc(fields.createdAt),
  });

  return c.json({
    message: "List gootten successfully",
    status: true,
    data: tasks,
  });
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const reqData = c.req.valid("json");

  const [data] = await db.insert(tasks).values(reqData).returning();

  return c.json(
    {
      message: "Task created successfully",
      status: true,
      data,
    },
    HttpStatusCodes.OK
  );
};
