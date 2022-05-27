/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Rating` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Rating` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
