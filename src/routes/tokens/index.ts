import { createRouter } from "@/lib/create-app";
import * as controllers from "./controllers";
import * as routes from "./routes";

const tokensRouter = createRouter()
  .openapi(routes.create, controllers.create)
  .openapi(routes.listOverview, controllers.listOverview)
  .openapi(routes.listFavourites, controllers.listFavourites)
  .openapi(routes.listUserCreatedTokens, controllers.listUserCreatedToken)
  .openapi(routes.patch, controllers.patch)
  .openapi(routes.getOne, controllers.getOne);

export default tokensRouter;
