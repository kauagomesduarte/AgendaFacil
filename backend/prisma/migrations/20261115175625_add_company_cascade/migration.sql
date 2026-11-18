-- DropForeignKey
ALTER TABLE "company_users" DROP CONSTRAINT "company_users_companyId_fkey";

-- DropForeignKey
ALTER TABLE "employee_service" DROP CONSTRAINT "employee_service_companyUserId_fkey";

-- DropForeignKey
ALTER TABLE "employee_service" DROP CONSTRAINT "employee_service_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_companyId_fkey";

-- AddForeignKey
ALTER TABLE "company_users" ADD CONSTRAINT "company_users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_service" ADD CONSTRAINT "employee_service_companyUserId_fkey" FOREIGN KEY ("companyUserId") REFERENCES "company_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_service" ADD CONSTRAINT "employee_service_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
