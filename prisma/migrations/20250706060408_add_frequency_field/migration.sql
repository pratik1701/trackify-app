-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('oneTime', 'recurring');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "frequency" "Frequency" NOT NULL DEFAULT 'recurring';
