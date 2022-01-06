import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/request";

async function main() {
  const client = new GraphQLClient("http://localhost:4000/graphql");
  const sdk = getSdk(client);
  const { recipe } = await sdk.getRecipe({ title: "Recipe 1" });
  console.log(`GraphQL data:`, recipe);
}

main();
