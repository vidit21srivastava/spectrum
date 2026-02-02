/*
  Warnings:

  - You are about to drop the column `inngestEventId` on the `Execution` table. All the data in the column will be lost.
  - You are about to drop the column `workflowId` on the `Execution` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inngestEventID]` on the table `Execution` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inngestEventID` to the `Execution` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowID` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Execution" DROP CONSTRAINT "Execution_workflowId_fkey";

-- DropIndex
DROP INDEX "Execution_inngestEventId_key";

-- AlterTable
ALTER TABLE "Execution" DROP COLUMN "inngestEventId",
DROP COLUMN "workflowId",
ADD COLUMN     "inngestEventID" TEXT NOT NULL,
ADD COLUMN     "workflowID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Execution_inngestEventID_key" ON "Execution"("inngestEventID");

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_workflowID_fkey" FOREIGN KEY ("workflowID") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
