import { apiReference } from "@scalar/hono-api-reference";

import env from "@/env";
import packageJSON from "../../package.json";
import type { AppOpenAPI } from "./types";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Tasks API",
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

      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: "Local",
        },
        {
          url: "https://staging.scalar.com",
          description: "Staging",
        },
        {
          url: "https://api.scalar.com",
          description: "Production",
        },
      ],
    })
  );
}
