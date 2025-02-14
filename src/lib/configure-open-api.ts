import type { AppOpenAPI } from "./types";

import packageJSON from "../../package.json";

export default function configureOpenApi(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Tasks API",
    },
  });
}
