import { createRoute } from "@hono/zod-openapi";

import { insertUsersSchema, selectUsersSchema } from "@/db/schema/user.schema";
import { HttpStatusCodes } from "@/stoker/http-status-codes-defined";
import { jsonContentRequired } from "@/stoker/openapi/helpers";
import {
  customJsonContent,
  customJsonErrorContent,
} from "@/stoker/openapi/helpers/json-content";

const tags = ["Users"];

export const create = createRoute({
  path: "/users",
  method: "post",
  request: {
    body: jsonContentRequired(insertUsersSchema, ""),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: customJsonContent(
      selectUsersSchema,
      "The created user."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: customJsonErrorContent(
      insertUsersSchema,
      "The validation error(s)."
    ),
  },
});

export type CreateRoute = typeof create;
