-- CreateEnum
CREATE TYPE "OrdenStatus" AS ENUM ('PENDIENTE', 'CANCELADO', 'ENVIADO');

-- CreateTable
CREATE TABLE "Orden" (
    "id" TEXT NOT NULL,
    "status" "OrdenStatus" NOT NULL DEFAULT 'PENDIENTE',
    "total" DOUBLE PRECISION NOT NULL,
    "totalItems" INTEGER NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenItem" (
    "id" TEXT NOT NULL,
    "productID" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" INTEGER NOT NULL,
    "ordenId" TEXT,

    CONSTRAINT "OrdenItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrdenItem" ADD CONSTRAINT "OrdenItem_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "Orden"("id") ON DELETE SET NULL ON UPDATE CASCADE;
