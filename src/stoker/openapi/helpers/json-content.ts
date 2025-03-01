import { z } from "zod";
import type { ZodSchema } from "./types.ts";

const jsonContent = <T extends ZodSchema>(schema: T, description: string) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
};

export default jsonContent;

export const customJsonContent = <T extends ZodSchema>(
  schema: T,
  description: string
) => {
  return {
    content: {
      "application/json": {
        schema: z.object({
          message: z.string(),
          status: z.boolean(),
          data: schema,
        }),
      },
    },
    description,
  };
};
export const customJsonErrorContent = <T extends ZodSchema>(
  schema: T,
  description: string
) => {
  return {
    content: {
      "application/json": {
        schema: z.object({
          message: z.string(),
          status: z.boolean(),
          data: schema,
        }),
      },
    },
    description,
  };
};
