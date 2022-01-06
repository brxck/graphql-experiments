import { intArg } from "nexus";
import { OutputDefinitionBlock } from "nexus/dist/blocks";
import { Context } from "../context";

type SharedFieldsDeclarator = (t: OutputDefinitionBlock<"any">) => void;

/** Helper function to workaround weird generic errors with OutputDefinitionBlock */
export const sharedFields = (fn: SharedFieldsDeclarator) => (t: unknown) => {
  const parameterizedT = t as OutputDefinitionBlock<"any">;
  fn(parameterizedT);
};

export const autoFields = sharedFields((t: OutputDefinitionBlock<"any">) => {
  t.nonNull.date("createdAt");
  t.nonNull.id("createdById");

  t.field("createdBy", {
    type: "User",
    resolve(root, args, ctx) {
      return ctx.db.user.findUnique({ where: { id: root.createdById } });
    },
  });

  t.nonNull.field("metadata", {
    type: "Equipment",
    deprecation: "This isn't even metadata, just use the root level pls",
    resolve(root, args, ctx) {
      return root;
    },
  });
});

export const paginationArgs = {
  skip: intArg({
    description: "How many records to skip for pagination",
  }),
  take: intArg({
    description: "How many records to return",
  }),
};

export async function createTimestampData(ctx: Context) {
  return {
    createdAt: new Date(),
    createdById: await ctx.db.user
      .findFirst({ select: { id: true }, rejectOnNotFound: true })
      .then((u) => u.id),
  };
}
