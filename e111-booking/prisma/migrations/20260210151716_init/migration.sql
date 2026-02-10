-- CreateEnum
CREATE TYPE "StaffLevel" AS ENUM ('Junior', 'Senior', 'Master', 'Star');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('Available', 'Booked', 'Leave', 'Break');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Unpaid', 'Paid', 'Refunded');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow');

-- CreateTable
CREATE TABLE "branches" (
    "branch_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20),
    "address" VARCHAR(255),
    "phone" VARCHAR(20),
    "line_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "category_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "icon_url" VARCHAR(255),
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "services" (
    "service_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "base_price" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "staff" (
    "staff_id" SERIAL NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "staff_code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50),
    "photo_url" VARCHAR(255),
    "level" "StaffLevel" NOT NULL DEFAULT 'Senior',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "staff_availability" (
    "availability_id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'Available',

    CONSTRAINT "staff_availability_pkey" PRIMARY KEY ("availability_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "customer_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100),
    "line_id" VARCHAR(50),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" BIGSERIAL NOT NULL,
    "booking_ref" VARCHAR(20) NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "booking_time" TIMESTAMP(3) NOT NULL,
    "total_duration" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Unpaid',
    "status" "BookingStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "booking_items" (
    "item_id" BIGSERIAL NOT NULL,
    "booking_id" BIGINT NOT NULL,
    "service_id" INTEGER NOT NULL,
    "staff_id" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");

-- CreateIndex
CREATE UNIQUE INDEX "staff_branch_id_staff_code_key" ON "staff"("branch_id", "staff_code");

-- CreateIndex
CREATE INDEX "staff_availability_staff_id_date_status_idx" ON "staff_availability"("staff_id", "date", "status");

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_ref_key" ON "bookings"("booking_ref");

-- CreateIndex
CREATE INDEX "bookings_booking_time_branch_id_idx" ON "bookings"("booking_time", "branch_id");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_availability" ADD CONSTRAINT "staff_availability_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items" ADD CONSTRAINT "booking_items_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE SET NULL ON UPDATE CASCADE;
