import { createRouter } from "@/lib/create-app";
import * as controllers from "./tasks.controller";
import * as routes from "./tasks.routes";

const tasksRouter = createRouter()
  .openapi(routes.create, controllers.create)
  .openapi(routes.list, controllers.list)
  .openapi(routes.getOne, controllers.getOne)
  .openapi(routes.patch, controllers.patch)
  .openapi(routes.remove, controllers.remove);

export default tasksRouter;
