import type { ZodSchema } from "./types.ts";

import jsonContent from "./json-content.js";

const jsonContentRequired = (schema: ZodSchema, description: string) => {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
};

export default jsonContentRequired;
