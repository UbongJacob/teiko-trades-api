import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

// import { pinoLogger } from "@/middlewares/pino-logger";
import { notFound, onError, serveEmojiFavicon } from "@/stoker/middlewares";
import type { AppBindings } from "./types";
import { defaultHook } from "@/stoker/openapi";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();

  app.use(serveEmojiFavicon("👻"));
  app.use(logger());
  // app.use(pinoLogger());

  app.notFound(notFound);

  app.onError(onError);

  app.use(
    "/*",
    cors({
      origin: ["http://localhost:3000", "https://teiko-trades.netlify.app"],
      // allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
      allowMethods: ["POST", "GET", "PATCH", "DELETE"],
      exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
      maxAge: 600,
      credentials: true,
    })
  );

  return app;
}
