import type { CompanyRole } from "../../../generated/prisma/enums.ts";

declare global{
    namespace Express{
        interface Request{
            user?:{
                id: number;
                email: string;
                role?: CompanyRole
            }
        }
    }
}

export {}