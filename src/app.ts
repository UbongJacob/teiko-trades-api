import index from "@/routes/index.routes";
import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import tasks from "./routes/tasks";
import coins from "./routes/coins";

const app = createApp();

const routes = [index, coins, tasks];

configureOpenApi(app);

routes.forEach((route) => app.route("/", route));

export default app;
