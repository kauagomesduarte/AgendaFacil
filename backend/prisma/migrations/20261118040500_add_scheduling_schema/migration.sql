-- Preserve company time zones for explicit backfill; do not assume UTC.
ALTER TABLE "companies"
ADD COLUMN "timeZone" VARCHAR(64);

CREATE TYPE "AppointmentStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'REJECTED',
    'CANCELLED',
    'COMPLETED',
    'NO_SHOW'
);

CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "companyUserId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "schedules_dayOfWeek_check" CHECK ("dayOfWeek" BETWEEN 1 AND 7),
    CONSTRAINT "schedules_startMinute_check" CHECK ("startMinute" BETWEEN 0 AND 1439),
    CONSTRAINT "schedules_endMinute_check" CHECK ("endMinute" BETWEEN 1 AND 1440),
    CONSTRAINT "schedules_time_order_check" CHECK ("startMinute" < "endMinute")
);

CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "companyUserId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "customerUserId" INTEGER NOT NULL,
    "startAt" TIMESTAMPTZ(3) NOT NULL,
    "endAt" TIMESTAMPTZ(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "companyNameAtBooking" VARCHAR(150) NOT NULL,
    "employeeNameAtBooking" VARCHAR(150),
    "serviceNameAtBooking" VARCHAR(150) NOT NULL,
    "customerNameAtBooking" VARCHAR(150) NOT NULL,
    "customerEmailAtBooking" VARCHAR(255) NOT NULL,
    "priceAtBooking" DECIMAL(10,2) NOT NULL,
    "durationMinutesAtBooking" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "appointments_time_order_check" CHECK ("endAt" > "startAt"),
    CONSTRAINT "appointments_duration_check" CHECK ("durationMinutesAtBooking" > 0),
    CONSTRAINT "appointments_price_check" CHECK ("priceAtBooking" >= 0)
);

CREATE INDEX "schedules_companyUserId_dayOfWeek_idx"
ON "schedules"("companyUserId", "dayOfWeek");

CREATE INDEX "appointments_companyUserId_startAt_idx"
ON "appointments"("companyUserId", "startAt");

CREATE INDEX "appointments_customerUserId_startAt_idx"
ON "appointments"("customerUserId", "startAt");

CREATE INDEX "appointments_status_startAt_idx"
ON "appointments"("status", "startAt");

-- Used by the exclusion constraints below for GiST equality operators.
CREATE EXTENSION IF NOT EXISTS "btree_gist";

ALTER TABLE "schedules"
ADD CONSTRAINT "schedules_no_overlap"
EXCLUDE USING gist (
    "companyUserId" WITH =,
    "dayOfWeek" WITH =,
    int4range("startMinute", "endMinute", '[)') WITH &&
);

ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_no_active_overlap"
EXCLUDE USING gist (
    "companyUserId" WITH =,
    tstzrange("startAt", "endAt", '[)') WITH &&
)
WHERE ("status" IN ('PENDING', 'CONFIRMED'));

-- Schedules are dependent availability data and may be removed with their employee.
ALTER TABLE "schedules"
ADD CONSTRAINT "schedules_companyUserId_fkey"
FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- These restrictions preserve appointment history through the assigned service
-- and the customer, while the existing company/service cascade policies remain.
ALTER TABLE "appointments"
ADD CONSTRAINT "appointments_employeeService_fkey"
FOREIGN KEY ("companyUserId", "serviceId")
REFERENCES "employee_service"("companyUserId", "serviceId")
ON DELETE RESTRICT ON UPDATE CASCADE,
ADD CONSTRAINT "appointments_customerUserId_fkey"
FOREIGN KEY ("customerUserId") REFERENCES "users"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
