import { z } from "zod";
import type { ZodSchema } from "./types.ts";
import oneOf from "./one-of.js";
import createErrorSchema from "../schemas/create-error-schema.js";

const jsonContent = (schema: ZodSchema, description: string) => {
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

// DO NOT REMOVE EXTENSION
export const customJsonContent = <T extends ZodSchema>(
  customSchema: T,
  description: string
) => {
  return {
    content: {
      "application/json": {
        schema: z.object({
          message: z.string(),
          status: z.boolean(),
          data: customSchema,
        }),
      },
    },
    description,
  };
};

export const customJsonErrorContent = <T extends ZodSchema>(
  customSchema: T,
  description: string
) => {
  return {
    content: {
      "application/json": {
        schema: z.object({
          message: z.string(),
          status: z.boolean().default(false),
          data: createErrorSchema(customSchema),
        }),
      },
    },
    description,
  };
};

export const oneOfErrorSchema = <T extends ZodSchema>(
  schemas: T[],
  description: string
) => {
  return {
    content: {
      "application/json": {
        schema: {
          oneOf: oneOf(
            schemas?.map((v) => {
              return z.object({
                message: z.string(),
                status: z.boolean().default(false),
                data: createErrorSchema(v),
              });
            })
          ),
        },
      },
    },
    description,
  };
};

export const customMessageContent = (status: boolean, description: string) => {
  return {
    content: {
      "application/json": {
        schema: z
          .object({
            message: z.string(),
            status: z.boolean().default(status),
          })
          .openapi({
            example: {
              message: description,
              status,
            },
          }),
      },
    },
    description,
  };
};
