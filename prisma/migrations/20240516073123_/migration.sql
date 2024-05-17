/*
  Warnings:

  - You are about to drop the column `date` on the `Clinic` table. All the data in the column will be lost.
  - The `date` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date` column on the `Patient` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_patientId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "doctorId" DROP NOT NULL,
ALTER COLUMN "patientId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Clinic" DROP COLUMN "date";

-- AlterTable
ALTER TABLE "Doctor" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3)[];

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3)[];

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
