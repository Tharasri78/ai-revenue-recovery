/*
  Warnings:

  - A unique constraint covering the columns `[businessEmail]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Merchant_businessEmail_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_businessEmail_key" ON "Merchant"("businessEmail");
