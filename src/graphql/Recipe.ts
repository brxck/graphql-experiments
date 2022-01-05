import { objectType, intArg, extendType, stringArg, nonNull } from "nexus";

export const Recipe = objectType({
  name: "Recipe",
  description: "Object representing cooking recipe",
  definition(t) {
    t.float("averageRating");
    t.date("creationDate");
    t.string("description", {
      description: "The recipe description with preparation info",
    });
    t.nonNull.list.nonNull.int("ratings");
    t.nonNull.int("ratingsCount", {
      args: {
        minRate: intArg(),
      },
      resolve(root, args, ctx) {
        return root.ratings.filter((rating) => rating >= (args.minRate ?? 0))
          .length;
      },
    });
    t.string("specification", {
      deprecation: "Use `description` field instead",
    });
    t.nonNull.string("title");
  },
});

export const RecipeQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("recipe", {
      type: "Recipe",
      args: { title: nonNull(stringArg()) },
      resolve(root, args, ctx) {
        return ctx.db.recipe.findFirst({ where: { title: args.title } });
      },
    });

    t.nonNull.list.field("recipes", {
      type: "Recipe",
      resolve(root, args, ctx) {
        return ctx.db.recipe.findMany();
      },
    });
  },
});

export const RecipeMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addRecipe", {
      type: "Recipe",
      args: { title: nonNull(stringArg()), description: stringArg() },
      resolve(root, args, ctx) {
        const recipe = {
          description: args.description,
          title: args.title,
          ratings: [],
          creationDate: new Date(),
        };
        return ctx.db.recipe.create({ data: recipe });
      },
    });
  },
});
