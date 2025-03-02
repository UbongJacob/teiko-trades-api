import db from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import type {
  CreateRoute,
  GetOneRoute,
  ListRoute,
  PatchRoute,
  RemoveRoute,
} from "./tasks.routes";
import { tasks } from "@/db/schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { eq } from "drizzle-orm";

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

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const task = await db.query.tasks.findFirst({
    where: (fields, operators) => operators.eq(fields?.id, id),
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
      message: "Task retrieved successfully",
      status: true,
      data: task,
    },
    HttpStatusCodes.OK
  );
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [task] = await db
    .update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

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
      message: "Task updated successfully",
      status: true,
      data: task,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(tasks).where(eq(tasks.id, id));

  if (result?.rowCount === 0) {
    return c.json(
      {
        message: "Not found.",
        status: false,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
