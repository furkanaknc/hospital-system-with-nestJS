-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'doctor';

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'patient';
