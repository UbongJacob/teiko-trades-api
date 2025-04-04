import { createRouter } from "@/lib/create-app";
import * as controllers from "./controllers";
import * as routes from "./routes";

const tokensRouter = createRouter()
  .openapi(routes.list, controllers.list)
  .openapi(routes.create, controllers.create)
  .openapi(routes.listOverview, controllers.listOverview)
  .openapi(routes.listFavourites, controllers.listFavourites)
  .openapi(routes.toggleFavourite, controllers.toggleFavourite)
  .openapi(routes.listUserCreatedTokens, controllers.listUserCreatedToken)
  .openapi(routes.patch, controllers.patch)
  .openapi(routes.getTokenChartData, controllers.getTokenChartData)
  .openapi(routes.getTokenPrice, controllers.getTokenPrice)
  .openapi(routes.getOne, controllers.getOne);

export default tokensRouter;
