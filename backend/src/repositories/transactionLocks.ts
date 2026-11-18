import type { Prisma } from "../../generated/prisma/client.js";

type LockMode = "SHARE" | "UPDATE";

export async function lockCompany(
    tx: Prisma.TransactionClient,
    companyId: number,
    mode: LockMode
) {
    if (mode === "UPDATE") {
        await tx.$queryRaw`SELECT "id" FROM "companies" WHERE "id" = ${companyId} FOR UPDATE`;
        return;
    }

    await tx.$queryRaw`SELECT "id" FROM "companies" WHERE "id" = ${companyId} FOR SHARE`;
}

export async function lockService(
    tx: Prisma.TransactionClient,
    serviceId: number,
    mode: LockMode
) {
    if (mode === "UPDATE") {
        await tx.$queryRaw`SELECT "id" FROM "services" WHERE "id" = ${serviceId} FOR UPDATE`;
        return;
    }

    await tx.$queryRaw`SELECT "id" FROM "services" WHERE "id" = ${serviceId} FOR SHARE`;
}

export async function lockCompanyUser(
    tx: Prisma.TransactionClient,
    companyUserId: number,
    mode: LockMode
) {
    if (mode === "UPDATE") {
        await tx.$queryRaw`SELECT "id" FROM "company_users" WHERE "id" = ${companyUserId} FOR UPDATE`;
        return;
    }

    await tx.$queryRaw`SELECT "id" FROM "company_users" WHERE "id" = ${companyUserId} FOR SHARE`;
}
