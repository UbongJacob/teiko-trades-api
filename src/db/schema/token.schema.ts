import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { UsersTable } from "./user.schema";
import { relations } from "drizzle-orm";

// TOKENS SCHEMA STARTS

export const BaseCurrency = pgEnum("baseCurrency", ["sbtc", "stx"]);

export const TokensTable = pgTable("tokens", {
  id: serial().primaryKey(),
  dexName: varchar({ length: 255 }).unique(),
  ticker: varchar({ length: 255 }).notNull(),
  uri: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  baseCurrency: BaseCurrency().default("sbtc").notNull(),
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

export const patchTokensSchema = insertTokensSchema.partial().omit({
  name: true,
  ticker: true,
  userId: true,
});
// TOKENS SCHEMA ENDS

// FAVOURITES TOKENS

export const UserFavouritesTokensTable = pgTable(
  "favouritesTokens",
  {
    // id: serial().primaryKey(),
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => UsersTable.walletAddress),
    tokenId: integer()
      .notNull()
      .references(() => TokensTable.id),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.tokenId] }),
    };
  }
);

export const selectFavouritesTokensSchema = createSelectSchema(
  UserFavouritesTokensTable
);

export const insertFavouritesTokensSchema = createInsertSchema(
  UserFavouritesTokensTable
).omit({
  // id: true,
  createdAt: true,
});

export const patchfavouritesTokensSchema =
  insertFavouritesTokensSchema.partial();

// TOKEN PRICE TABLE

export const TokenPriceTable = pgTable(
  "tokenPrice",
  {
    price: varchar({ length: 255 }).notNull(),
    tokenId: integer()
      .notNull()
      .references(() => TokensTable.id),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.tokenId, table.price] }),
    };
  }
);

export const selectPriceTokensSchema = createSelectSchema(TokenPriceTable).omit(
  {
    tokenId: true,
  }
);

const insertPriceToken = createInsertSchema(TokenPriceTable).omit({
  createdAt: true,
});
export type IinsertPriceToken = typeof insertPriceToken._type;

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
      token: one(TokensTable, {
        fields: [UserFavouritesTokensTable.tokenId],
        references: [TokensTable.id],
      }),
      user: one(UsersTable, {
        fields: [UserFavouritesTokensTable.userId],
        references: [UsersTable.walletAddress],
      }),
    };
  }
);
