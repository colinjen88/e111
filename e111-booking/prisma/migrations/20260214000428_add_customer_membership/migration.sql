-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "memberLevel" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "password" TEXT,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
