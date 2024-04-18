-- AlterEnum
ALTER TYPE "OrdenStatus" ADD VALUE 'PAGADO';

-- AlterTable
ALTER TABLE "Orden" ADD COLUMN     "stripeId" TEXT;

-- CreateTable
CREATE TABLE "ReciboPago" (
    "id" TEXT NOT NULL,
    "ordenId" TEXT NOT NULL,
    "reciboUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReciboPago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReciboPago_ordenId_key" ON "ReciboPago"("ordenId");

-- AddForeignKey
ALTER TABLE "ReciboPago" ADD CONSTRAINT "ReciboPago_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
