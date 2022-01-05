import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./entities/recipe/resolvers";

export function getSchema(path?: string) {
  return buildSchema({
    resolvers: [RecipeResolver],
    emitSchemaFile: path ?? false,
  });
}
