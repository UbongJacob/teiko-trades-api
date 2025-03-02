import index from "@/routes/index.routes";
import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import tasks from "./routes/tasks";

const app = createApp();

const routes = [index, tasks];

configureOpenApi(app);

routes.forEach((route) => app.route("/", route));

export default app;
