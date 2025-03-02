import { createRoute, z } from "@hono/zod-openapi";

import {
  insertTaskSchema,
  patchTaskSchema,
  selectTasksSchema,
} from "@/db/schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { jsonContentRequired } from "@/stoker/openapi/helpers";
import {
  customJsonContent,
  customJsonErrorContent,
  customMessageContent,
  oneOfErrorSchema,
} from "@/stoker/openapi/helpers/json-content";
import { IdParamsSchema } from "@/stoker/openapi/schemas";

const tags = ["Tasks"];

export const list = createRoute({
  path: "/tasks",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      z.array(selectTasksSchema),
      "The list of tasks"
    ),
  },
});

export const create = createRoute({
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(insertTaskSchema, ""),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTasksSchema,
      "The created task."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      insertTaskSchema,
      "The validation error(s)."
    ),
  },
});

export const getOne = createRoute({
  path: "/tasks/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTasksSchema,
      "The requested task"
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      IdParamsSchema,
      "Invalid Id error."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(false, "Task not found."),
  },
});

export const patch = createRoute({
  path: "/tasks/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(patchTaskSchema, ""),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTasksSchema,
      "The updated task."
    ),

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: oneOfErrorSchema(
      [IdParamsSchema, patchTaskSchema],
      "The validation error(s)."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(false, "Task not found."),
  },
});

export const remove = createRoute({
  path: "/tasks/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Task deleted",
    },

    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      IdParamsSchema,
      "Invalid id error."
    ),

    [HttpStatusCodes.NOT_FOUND]: customMessageContent(false, "Task not found."),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
