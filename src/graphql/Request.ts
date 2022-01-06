import {
  objectType,
  enumType,
  extendType,
  inputObjectType,
  nonNull,
  stringArg,
} from "nexus";
import {
  autoFields,
  createTimestampData,
  paginationArgs,
  sharedFields,
} from "./common";

export const RequestStatus = enumType({
  name: "RequestStatus",
  members: ["internal", "dispatch", "pending", "completed"],
});

export const Request = objectType({
  name: "Request",
  description: "Request for help with Equipment",
  definition(t) {
    t.nonNull.string("description", {
      description: "The request description with preparation info",
    });
    t.nonNull.int("severity");
    t.nonNull.field("status", { type: "RequestStatus" });
    t.nonNull.string("equipmentId");
    t.field("equipment", {
      type: "Equipment",
      resolve(root, args, ctx) {
        // Prisma automatically batches findUnique to avoid N+1!
        return ctx.db.equipment.findUnique({ where: { id: root.equipmentId } });
      },
    });
    autoFields(t);
  },
});

export const CreateRequestInput = inputObjectType({
  name: "CreateRequestInput",
  definition(t) {
    t.nonNull.string("description");
    t.nonNull.int("severity");
    t.nonNull.field("status", { type: "RequestStatus" });
    t.nonNull.string("equipmentId");
  },
});

export const UpdateRequestInput = inputObjectType({
  name: "UpdateRequestInput",
  definition(t) {
    t.nonNull.string("id");
    t.string("description");
    t.int("severity");
    t.string("equipmentId");
    t.field("status", { type: "RequestStatus" });
  },
});

export const RequestQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("request", {
      type: "Request",
      args: { id: nonNull(stringArg()) },
      resolve(root, args, ctx) {
        return ctx.db.request.findUnique({
          where: { id: args.id },
        });
      },
    });

    t.nonNull.list.field("requests", {
      type: nonNull("Request"),
      args: { ...paginationArgs },
      resolve(root, args, ctx) {
        return ctx.db.request.findMany({
          take: args.take ?? undefined,
          skip: args.skip ?? undefined,
        });
      },
    });
  },
});

export const RequestMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createRequest", {
      type: "Request",
      args: { data: nonNull("CreateRequestInput") },
      async resolve(root, args, ctx) {
        return ctx.db.request.create({
          data: {
            ...args.data,
            ...(await createTimestampData(ctx)),
          },
        });
      },
    });
    t.nonNull.field("updateRequest", {
      type: "Request",
      args: { data: nonNull("UpdateRequestInput") },
      async resolve(root, args, ctx) {
        const { id, ...data } = args.data;
        return ctx.db.request.update({
          where: { id: args.data.id },
          data: {
            description: data.description ?? undefined,
            equipmentId: data.equipmentId ?? undefined,
            severity: data.severity ?? undefined,
            status: data.status ?? undefined,
            ...(await createTimestampData(ctx)),
          },
        });
      },
    });
  },
});
