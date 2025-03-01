import { createRoute, z } from "@hono/zod-openapi";

import { insertTaskSchema, selectTasksSchema } from "@/db/schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { jsonContentRequired } from "@/stoker/openapi/helpers";
import {
  customJsonContent,
  customJsonErrorContent,
} from "@/stoker/openapi/helpers/json-content";
import { createErrorSchema } from "@/stoker/openapi/schemas";

const tags = ["Tasks"];

const list = createRoute({
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

const create = createRoute({
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(insertTaskSchema, "The task to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectTasksSchema,
      "The created task."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      createErrorSchema(insertTaskSchema),
      "The validation error(s)."
    ),
  },
});

export default { list, create };

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
