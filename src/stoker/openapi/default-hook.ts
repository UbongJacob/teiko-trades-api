import type { Hook } from "@hono/zod-openapi";
import { fromError } from "zod-validation-error";

import { UNPROCESSABLE_ENTITY } from "../http-status-codes.js";

const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    const e = result?.error?.flatten();
    let errors = "Invalid request.";
    if (!!e?.fieldErrors && !!e?.formErrors) {
      errors = fromError(result?.error, { maxIssuesInMessage: 1 })?.toString();
    }
    return c.json(
      {
        status: result?.success,
        message: errors,
        data: result?.error,
      },
      UNPROCESSABLE_ENTITY
    );
  }
};

export default defaultHook;
