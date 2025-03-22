import { fetchCallReadOnlyFunction, cvToValue } from "@stacks/transactions";

import db from "@/db";
import { TokenPriceTable, type IinsertPriceToken } from "@/db/schema";

export const getPrice = async () => {
  try {
    const tokens = await db.query.TokensTable.findMany();

    const tokenWithPrices: IinsertPriceToken[] = [];

    const promises = tokens.map(async ({ dexName, userId, id }) => {
      if (!!dexName && !!userId && !!id) {
        try {
          const response = await fetchCallReadOnlyFunction({
            contractAddress: userId,
            contractName: dexName,
            functionName: "get-price",
            functionArgs: [],
            network: "testnet",
            senderAddress: userId,
          });

          const price = cvToValue(response)?.value ?? "";

          tokenWithPrices.push({ price, tokenId: id });
        } catch (error) {
          console.log("A fetch error occurred");
        }
      }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);

    if (tokenWithPrices.length > 0) {
      await db.insert(TokenPriceTable).values(tokenWithPrices);
    }
  } catch (error) {
    console.log("An error occurred", error);
  }
};
