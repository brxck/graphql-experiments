/*
  Warnings:

  - The values [INTERNAL,DISPATCH,PENDING,COMPLETED] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CLIENT,ADMIN,PROVIDER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('internal', 'dispatch', 'pending', 'completed');
ALTER TABLE "Request" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "RequestStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('client', 'admin', 'provider');
ALTER TABLE "User" ALTER COLUMN "userRole" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "userRole" TYPE "UserRole_new" USING ("userRole"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "userRole" SET DEFAULT 'client';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "userRole" SET DEFAULT E'client';
