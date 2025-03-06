import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { UserFavouritesTokensTable } from "./token.schema";

export const UsersTable = pgTable("users", {
  walletAddress: varchar({ length: 255 }).notNull().unique().primaryKey(),
  createdAt: timestamp().defaultNow(),
});

export const selectUsersSchema = createSelectSchema(UsersTable);

export const insertUsersSchema = createInsertSchema(UsersTable).omit({
  createdAt: true,
});

// RELATIONS
export const UserTableRelations = relations(UsersTable, ({ many }) => {
  return {
    favourites: many(UserFavouritesTokensTable),
  };
});
