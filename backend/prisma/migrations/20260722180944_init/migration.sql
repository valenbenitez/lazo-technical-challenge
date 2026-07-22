-- CreateEnum
CREATE TYPE "ObligationType" AS ENUM ('annual_report', 'franchise_tax', 'boi_report', 'registered_agent_renewal');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('pending', 'in_progress', 'submitted', 'done');

-- CreateTable
CREATE TABLE "ObligationStatusHistory" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "fromStatus" "ObligationStatus",
    "toStatus" "ObligationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ObligationStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Obligation" (
    "id" TEXT NOT NULL,
    "type" "ObligationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ObligationStatus" NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "owner" TEXT NOT NULL,
    "requiresDocument" BOOLEAN NOT NULL DEFAULT false,
    "documentUrl" TEXT,
    "documentName" TEXT,
    "companyTaxId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Obligation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ObligationStatusHistory" ADD CONSTRAINT "ObligationStatusHistory_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "Obligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
