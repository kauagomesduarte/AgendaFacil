import { Router } from "express";
import * as schedulesController from "../controllers/schedules.controller.js";
import { createScheduleSchema, updateScheduleSchema } from "../dtos/schedules.dto.js";
import { validate } from "../middlewares/zodValidate.mw.js";
import { validateToken } from "../middlewares/auth.mw.js";
import { authorizeByRole } from "../middlewares/authorization.mw.js";

const router = Router({ mergeParams: true });

router.get(
    "/",
    validateToken,
    authorizeByRole(["EMPLOYEE", "MANAGER", "OWNER"]),
    schedulesController.getSchedules
);

router.post(
    "/",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    validate(createScheduleSchema),
    schedulesController.createSchedule
);

router.patch(
    "/:scheduleId",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    validate(updateScheduleSchema),
    schedulesController.updateSchedule
);

router.delete(
    "/:scheduleId",
    validateToken,
    authorizeByRole(["MANAGER", "OWNER"]),
    schedulesController.deleteSchedule
);

export default router;
