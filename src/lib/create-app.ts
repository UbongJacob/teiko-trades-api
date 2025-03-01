import { OpenAPIHono } from "@hono/zod-openapi";

import { pinoLogger } from "@/middlewares/pino-logger";
import { notFound, onError, serveEmojiFavicon } from "@/stoker/middlewares";
import type { AppBindings } from "./types";
import { defaultHook } from "@/stoker/openapi";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();

  app.use(serveEmojiFavicon("👻"));
  app.use(pinoLogger());

  app.notFound(notFound);

  app.onError(onError);
  return app;
}
