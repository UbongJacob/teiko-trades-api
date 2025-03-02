import { z } from "@hono/zod-openapi";

const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    type: "number",
    example: 42,
  }),
});

export default IdParamsSchema;

// import { z } from "@hono/zod-openapi";

// const IdParamsSchema = z.object({
//   id: z.coerce.number().openapi({
//     param: {
//       name: "id",
//       in: "path",
//       allowEmptyValue: false,
//       style: "deepObject",
//       explode: true,
//       required: true,
//     },
//     required: ["id"],
//     type: "number",
//     enum: [
//       {
//         boy: 1,
//       },
//       2,
//       3,
//     ],
//     example: 42,
//   }),
// });

// export default IdParamsSchema;
