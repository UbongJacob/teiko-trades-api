import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { UsersTable } from "./user.schema";
import { relations } from "drizzle-orm";

// TOKENS SCHEMA STARTS

export const TokensTable = pgTable("tokens", {
  id: serial().primaryKey(),
  address: varchar({ length: 255 }).notNull().unique(),
  dexAddress: varchar({ length: 255 }).notNull().unique(),
  ticker: varchar({ length: 255 }).notNull(),
  uri: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  userId: varchar({ length: 255 })
    .references(() => UsersTable.walletAddress)
    .notNull(),
});

export const selectTokensSchema = createSelectSchema(TokensTable);

export const insertTokensSchema = createInsertSchema(TokensTable, {
  name: (schema) => schema.min(3).max(255),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTokensSchema = insertTokensSchema.partial();

// TOKENS SCHEMA ENDS

// FAVOURITES TOKENS

export const UserFavouritesTokensTable = pgTable("favouritesTokens", {
  id: serial().primaryKey(),
  userId: varchar({ length: 255 })
    .references(() => UsersTable.walletAddress)
    .notNull(),
  tokenId: integer()
    .notNull()
    .references(() => TokensTable.id),
  createdAt: timestamp().defaultNow().notNull(),
});

export const selectFavouritesTokensSchema = createSelectSchema(
  UserFavouritesTokensTable
);

export const insertFavouritesTokensSchema = createInsertSchema(
  UserFavouritesTokensTable
).omit({
  id: true,
  createdAt: true,
});

export const patchfavouritesTokensSchema =
  insertFavouritesTokensSchema.partial();

// OVERVIEW TOKENS

export const OverviewTokensTable = pgTable("overviewTokens", {
  id: serial().primaryKey(),
  ticker: varchar({ length: 255 }).notNull(),
  tokenId: integer()
    .notNull()
    .references(() => TokensTable.id),
  createdAt: timestamp().defaultNow().notNull(),
});

export const selectOverviewTokensSchema =
  createSelectSchema(OverviewTokensTable);

export const insertOverviewTokensSchema = createInsertSchema(
  OverviewTokensTable
).omit({
  id: true,
  createdAt: true,
});

// export const patchOverviewTokensSchema = insertOverviewTokensSchema.partial();

// RELATIONS
export const TokenRelations = relations(TokensTable, ({ many }) => {
  return {
    overview: many(OverviewTokensTable),
  };
});

export const OverviewTokenRelations = relations(
  OverviewTokensTable,
  ({ one }) => {
    return {
      overview: one(TokensTable, {
        fields: [OverviewTokensTable.tokenId],
        references: [TokensTable.id],
      }),
    };
  }
);

export const UserFavouritesTokensRelations = relations(
  UserFavouritesTokensTable,
  ({ one }) => {
    return {
      overview: one(TokensTable, {
        fields: [UserFavouritesTokensTable.tokenId],
        references: [TokensTable.id],
      }),
    };
  }
);
