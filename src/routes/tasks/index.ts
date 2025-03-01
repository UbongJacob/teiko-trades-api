import { createRouter } from "@/lib/create-app";
import * as controller from "./tasks.controller";
import * as routes from "./tasks.routes";

const tasksRouter = createRouter()
  .openapi(routes.create, controller.create)
  .openapi(routes.list, controller.list);

export default tasksRouter;
