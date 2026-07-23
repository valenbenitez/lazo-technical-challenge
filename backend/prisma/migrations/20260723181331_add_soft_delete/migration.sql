-- AlterTable
ALTER TABLE "Obligation" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true;
