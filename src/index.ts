import { serve } from "@hono/node-server";
import app from "./app";
import env from "./env";
import { Cron } from "croner";

import { getPrice } from "./routes/coins/controller";

const port = env.PORT;
console.log(`Server is running on http://localhost:${port}`);

// const job = new Cron("* * * * *", () => {
//   console.log("This will every 1 minute");
//   getPrice();
// });

serve({
  fetch: app.fetch,
  port,
});
