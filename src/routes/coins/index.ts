import { createRouter } from "@/lib/create-app";
import tasksController from "./controller";
import tasksRoutes from "./routes";

const coinRouter = createRouter()
  .openapi(tasksRoutes.list, tasksController.list)
  .openapi(tasksRoutes.saveCoinPrice, tasksController.saveCoinPrice)
  .openapi(tasksRoutes.listAllPrices, tasksController.listAllPrices)
  .openapi(tasksRoutes.createToken, tasksController.createToken)
  .openapi(tasksRoutes.listToken, tasksController.listAllTokens);
// .openapi(tasksRoutes.create, tasksController.create)

export default coinRouter;
