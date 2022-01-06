import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { resolvers } from "@generated/type-graphql";

export function getSchema(path?: string) {
  return buildSchema({
    resolvers: resolvers,
    emitSchemaFile: path ?? false,
  });
}
