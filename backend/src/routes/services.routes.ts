
import { Router } from "express";
import * as serviceController from "../controllers/services.controller.js";
import { validate } from "../middlewares/zodValidate.mw.js";
import {createServiceSchema, updateServiceSchema} from "../dtos/services.dto.js";
import { validateToken } from "../middlewares/auth.mw.js";
import { authorizeByRole } from "../middlewares/authorization.mw.js";

const router = Router({ mergeParams: true });

// CRUD de serviços

router.post(
    "/",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    validate(createServiceSchema),
    serviceController.createService
);

router.get(
    "/",
    serviceController.getAllServices
);

router.get(
    "/:serviceId",
    serviceController.getService
);

router.patch(
    "/:serviceId",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    validate(updateServiceSchema),
    serviceController.updateService
);

router.delete(
    "/:serviceId",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    serviceController.deleteService
);

// Funcionários e serviços

router.post(
    "/:serviceId/emp/:employeeId",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    serviceController.assignEmployeeService
);

router.delete(
    "/:serviceId/emp/:employeeId",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    serviceController.removeEmployeeService
);

router.get(
    "/emp/:employeeId",
    serviceController.getEmployeeServices
);

export default router;
