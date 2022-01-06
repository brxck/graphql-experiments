/*
  Warnings:

  - Added the required column `equipmentId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "equipmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
