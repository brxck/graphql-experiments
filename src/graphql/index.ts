import { decorateType } from "nexus";
import { GraphQLDate } from "graphql-iso-date";

export const GQLDate = decorateType(GraphQLDate, {
  sourceType: "Date",
  asNexusMethod: "date",
});

export * from "./Recipe";
