import {
  objectType,
  extendType,
  stringArg,
  nonNull,
  enumType,
  inputObjectType,
} from "nexus";
import { autoFields, createTimestampData, paginationArgs } from "./common";

export const UserRole = enumType({
  name: "UserRole",
  members: ["client", "admin", "provider"],
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("fullName");
    t.nonNull.field("userRole", { type: UserRole });
    autoFields(t);
  },
});

export const CreateUserInput = inputObjectType({
  name: "CreateUserInput",
  definition(t) {
    t.nonNull.string("fullName");
    t.field("userRole", {
      type: "UserRole",
      authorize(root, args, ctx) {
        // check that user is an admin
        return true;
      },
    });
  },
});

export const UpdateUserInput = inputObjectType({
  name: "UpdateUserInput",
  definition(t) {
    t.nonNull.id("id");
    t.string("fullName");
    t.field("userRole", {
      type: "UserRole",
      authorize(root, args, ctx) {
        // check that user is an admin
        return true;
      },
    });
  },
});

export const UserQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("user", {
      type: "User",
      args: { id: nonNull(stringArg()) },
      resolve(root, args, ctx) {
        return ctx.db.user.findFirst({
          where: { id: args.id },
        });
      },
    });

    t.nonNull.list.field("users", {
      type: "User",
      args: { ...paginationArgs },
      resolve(root, args, ctx) {
        return ctx.db.user.findMany({
          take: args.take ?? undefined,
          skip: args.skip ?? undefined,
        });
      },
    });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: "User",
      args: { data: nonNull("CreateUserInput") },
      authorize() {
        return true; // check that user is admin
      },
      async resolve(root, args, ctx) {
        return ctx.db.user.create({
          data: {
            fullName: args.data.fullName,
            // There's way in Nexus to prevent nulls for optional args.
            // Ex. userRole?: string instead of userRole?: string | null
            // https://github.com/graphql-nexus/nexus/issues/819
            userRole: args.data.userRole ?? undefined,
            ...(await createTimestampData(ctx)),
          },
        });
      },
    });
    t.nonNull.field("updateUser", {
      type: "User",
      args: { data: nonNull("UpdateUserInput") },
      async resolve(root, args, ctx) {
        const { id, ...data } = args.data;
        return ctx.db.user.update({
          where: { id },
          data: {
            fullName: data.fullName ?? undefined,
            userRole: data.userRole ?? undefined,
            ...(await createTimestampData(ctx)),
          },
        });
      },
    });
  },
});
