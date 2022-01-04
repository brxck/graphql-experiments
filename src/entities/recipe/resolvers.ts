import {
  Resolver,
  Query,
  FieldResolver,
  Arg,
  Root,
  Mutation,
  Int,
  ResolverInterface,
} from "type-graphql";
import { prisma } from "../../db";
import { Recipe, RecipeInput } from "./types";
import { Recipe as RecipeData } from "@prisma/client";

@Resolver((of) => Recipe)
export class RecipeResolver implements ResolverInterface<Recipe> {
  @Query((returns) => Recipe, { nullable: true })
  async recipe(@Arg("title") title: string): Promise<RecipeData | null> {
    return prisma.recipe.findFirst({ where: { title: title } });
  }

  @Query((returns) => [Recipe], {
    description: "Get all the recipes from around the world ",
  })
  async recipes(): Promise<RecipeData[]> {
    return prisma.recipe.findMany();
  }

  @Mutation((returns) => Recipe)
  async addRecipe(
    @Arg("recipe") recipeInput: RecipeInput
  ): Promise<RecipeData> {
    const recipe = Object.assign(new Recipe(), {
      description: recipeInput.description,
      title: recipeInput.title,
      ratings: [],
      creationDate: new Date(),
    });
    return prisma.recipe.create({ data: recipe });
  }

  @FieldResolver()
  ratingsCount(
    @Root() recipe: Recipe,
    @Arg("minRate", (type) => Int, { defaultValue: 0.0 }) minRate: number
  ): number {
    return recipe.ratings.filter((rating) => rating >= minRate).length;
  }
}
