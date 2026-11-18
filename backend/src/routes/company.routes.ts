import {Router} from 'express';
import { validateToken } from '../middlewares/auth.mw.js';
import { createCompany, findCompanybyId, updateCompany, deleteCompany, findCompanies } from '../controllers/company.controller.js';

const router = Router();

import employeeRoutes from "./employee.routes.js";
router.use("/:companyId/emp", employeeRoutes);

import servicesRoutes from "./services.routes.js";
import { validate } from '../middlewares/zodValidate.mw.js';
import { createCompanySchema, updateCompanySchema } from '../dtos/company.dto.js';
import { authorizeByRole } from '../middlewares/authorization.mw.js';
router.use("/:companyId/serv", servicesRoutes);

router.post(
    "/",
    validate(createCompanySchema),
    createCompany
);

router.get(
    "/:id",
    findCompanybyId
);

router.get(
    "/",
    findCompanies
)

router.patch(
    "/:id",
    authorizeByRole(["OWNER"]),
    validate(updateCompanySchema),
    updateCompany
);

router.delete(
    "/:id",
    deleteCompany
);

export default router;