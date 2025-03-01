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

export const coin = pgTable("coins", {
  id: serial().primaryKey(),
  address: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const selectCoinsSchema = createSelectSchema(coin);

export const insertCoinSchema = createInsertSchema(coin, {
  address: (schema) => schema.min(3).max(255),
}).omit({
  id: true,
  createdAt: true,
});

export const price = pgTable("price", {
  price: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
});

export const selectPriceSchema = createSelectSchema(price);

export const insertPriceSchema = createInsertSchema(price).omit({
  createdAt: true,
});

export const userTable = pgTable("users", {
  walletAddress: varchar({ length: 255 }).notNull().primaryKey(),
  createdAt: timestamp().defaultNow(),
});

export const tokenTable = pgTable("tokens", {
  address: varchar({ length: 255 }).notNull().primaryKey().unique(),
  dexAddress: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  ticker: varchar({ length: 255 }).notNull(),
  meta: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  userId: varchar({ length: 255 })
    .references(() => userTable.walletAddress)
    .notNull(),
});

export const insertTokenSchema = createInsertSchema(tokenTable, {
  name: (schema) => schema.min(3).max(255),
}).omit({
  createdAt: true,
});

export const selectTokenSchema = createSelectSchema(tokenTable);

export const insertUserSchema = createInsertSchema(userTable).omit({
  createdAt: true,
});

export const selectUserSchema = createSelectSchema(userTable);
