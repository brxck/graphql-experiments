import {
  extendType,
  inputObjectType,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { autoFields, createTimestampData, paginationArgs } from "./common";

export const Equipment = objectType({
  name: "Equipment",
  description: "Equipment for help with Equipment",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("name");
    t.string("model");
    t.string("serialNumber");
    autoFields(t);
  },
});

export const CreateEquipmentInput = inputObjectType({
  name: "CreateEquipmentInput",
  definition(t) {
    t.nonNull.string("name");
    t.string("model");
    t.string("serialNumber");
  },
});

export const UpdateEquipmentInput = inputObjectType({
  name: "UpdateEquipmentInput",
  definition(t) {
    t.nonNull.string("id");
    t.string("name");
    t.string("model");
    t.string("serialNumber");
  },
});

export const EquipmentQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("equipment", {
      type: "Equipment",
      args: { id: nonNull(stringArg()) },
      resolve(root, args, ctx) {
        return ctx.db.equipment.findFirst({
          where: { id: args.id },
        });
      },
    });

    t.nonNull.list.field("equipments", {
      type: "Equipment",
      args: { ...paginationArgs },
      resolve(root, args, ctx) {
        return ctx.db.equipment.findMany({
          take: args.take ?? undefined,
          skip: args.skip ?? undefined,
        });
      },
    });
  },
});

export const EquipmentMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createEquipment", {
      type: "Equipment",
      args: { data: nonNull("CreateEquipmentInput") },
      async resolve(root, args, ctx) {
        return ctx.db.equipment.create({
          data: {
            ...args.data,
            ...(await createTimestampData(ctx)),
          },
        });
      },
    });
    t.nonNull.field("updateEquipment", {
      type: "Equipment",
      args: { data: nonNull("UpdateEquipmentInput") },
      async resolve(root, args, ctx) {
        const { id, ...data } = args.data;
        return ctx.db.equipment.update({
          where: { id: args.data.id },
          data: {
            ...data,
            name: data.name ?? undefined,
            ...(await createTimestampData(ctx)),
          },
        });
      },
    });
  },
});
