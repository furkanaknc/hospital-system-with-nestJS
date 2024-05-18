/*
  Warnings:

  - You are about to drop the column `doctorId` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `Clinic` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Doctor` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Clinic" DROP CONSTRAINT "Clinic_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Clinic" DROP CONSTRAINT "Clinic_patientId_fkey";

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "doctorId",
DROP COLUMN "patientId";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "date";
