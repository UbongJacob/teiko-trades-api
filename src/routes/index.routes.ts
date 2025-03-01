import { createRouter } from "@/lib/create-app";
import * as HttpStatusCodes from "@/stoker/http-status-codes";
import jsonContent from "@/stoker/openapi/helpers/json-content";
import { createMessageObjectSchema } from "@/stoker/openapi/schemas";
import { createRoute } from "@hono/zod-openapi";

const router = createRouter().openapi(
  createRoute({
    tags: ["index"],
    method: "get",
    path: "/",
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        createMessageObjectSchema("Tasks API"),
        "Tasks API Index"
      ),
    },
  }),
  (c) => {
    return c.json(
      {
        message: "Tasks API",
      },
      HttpStatusCodes.OK
    );
  }
);

export default router;
