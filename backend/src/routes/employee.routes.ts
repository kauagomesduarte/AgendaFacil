import { Router } from "express";
import { validateToken } from "../middlewares/auth.mw.js";
import { authorizeByRole } from "../middlewares/authorization.mw.js";
import { addEmployee, findAllEmployee, findEmployee, removeEmployee, updateRole } from "../controllers/employee.controller.js";

const router = Router({mergeParams: true});

import schedulesRoutes from "./schedules.routes.js";
router.use("/:employeeId/schedules", schedulesRoutes);

router.post(
    "/",
    validateToken,
    authorizeByRole(["OWNER", "MANAGER"]),
    addEmployee
);

router.get(
    "/",
    validateToken,
    authorizeByRole(["EMPLOYEE", "MANAGER", "OWNER"]),
    findAllEmployee
);

router.get(
    "/:userId",
    validateToken,
    authorizeByRole(["EMPLOYEE", "MANAGER", "OWNER"]),
    findEmployee
);

router.patch(
    "/:employeeId",
    validateToken,
    authorizeByRole(["OWNER"]),
    updateRole
);

router.delete(
    "/:employeeId",
    validateToken,
    authorizeByRole(["OWNER", "MANAGER"]),
    removeEmployee
);

export default router;