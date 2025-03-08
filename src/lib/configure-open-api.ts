import { apiReference } from "@scalar/hono-api-reference";

import env from "@/env";
import type { AppOpenAPI } from "./types";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1",
      title: "API Documentation.",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "bluePlanet",
      layout: "classic",
      hideDownloadButton: true,
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
      spec: {
        url: "/doc",
      },

      servers: [getServer()],
    })
  );
}

function getServer() {
  if (env?.NODE_ENV != "production") {
    return {
      url: `http://localhost:${env.PORT}`,
      description: "Local",
    };
  }

  return {
    url: env.APP_URL,
    description: "Staging",
  };
}
