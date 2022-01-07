import { db } from "../db";

async function seed() {
  await db.user.createMany({
    data: [
      { fullName: "Bork Macklebot", createdById: "unknown", userRole: "admin" },
    ],
  });

  const primeUser = await db.user.findFirst({ rejectOnNotFound: true });

  await db.equipment.createMany({
    data: [
      {
        name: "Goddard",
        model: "Robot Dog",
        serialNumber: "000",
        createdById: primeUser.id,
      },
    ],
  });

  const primeEquipment = await db.equipment.findFirst({
    rejectOnNotFound: true,
  });

  db.request.createMany({
    data: [
      {
        description: "halp",
        equipmentId: primeEquipment.id,
        createdById: primeUser.id,
        severity: 5,
        status: "pending",
      },
    ],
  });

  console.log("Seeded");
}

seed();
