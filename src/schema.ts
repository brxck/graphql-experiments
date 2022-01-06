import { fieldAuthorizePlugin, makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";

export const schema = makeSchema({
  types,
  contextType: {
    module: join(__dirname, "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
  plugins: [fieldAuthorizePlugin()],
  outputs: {
    typegen: join(__dirname, "generated", "nexus-typegen.ts"),
    schema: join(__dirname, "generated", "schema.graphql"),
  },
});
