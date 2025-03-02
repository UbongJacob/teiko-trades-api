import {
  boolean,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = pgTable("tasks", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  done: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp("updated_at")
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks, {
  name: (schema) => schema.min(3).max(255),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .required({
    done: true,
  });
export const patchTaskSchema = insertTaskSchema.partial();
