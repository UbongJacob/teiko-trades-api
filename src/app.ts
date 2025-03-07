import index from "@/routes/index.routes";
import configureOpenApi from "./lib/configure-open-api";
import createApp from "./lib/create-app";
import tokensRouter from "./routes/tokens";
import usersRouter from "./routes/users";

const app = createApp();

const routes = [index, tokensRouter, usersRouter];

configureOpenApi(app);

routes.forEach((route) => app.route("/", route));

export default app;
