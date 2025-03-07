import { createRouter } from "@/lib/create-app";
import * as controllers from "./controller";
import * as routes from "./routes";

const usersRouter = createRouter().openapi(routes.create, controllers.create);

export default usersRouter;
