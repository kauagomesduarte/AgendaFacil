import { Router } from "express";
import * as appointmentsController from "../controllers/appointments.controller.js";
import { validateToken } from "../middlewares/auth.mw.js";
import { authorizeByRole } from "../middlewares/authorization.mw.js";

const router = Router({ mergeParams: true });
const companyRoles = ["EMPLOYEE", "MANAGER", "OWNER"] as const;
const managementRoles = ["EMPLOYEE", "MANAGER", "OWNER"] as const;

router.get(
    "/",
    validateToken,
    authorizeByRole([...companyRoles]),
    appointmentsController.listCompanyAppointments
);

router.get(
    "/:appointmentId",
    validateToken,
    authorizeByRole([...companyRoles]),
    appointmentsController.getCompanyAppointment
);

for (const action of ["confirm", "reject", "cancel", "complete", "no-show"] as const) {
    router.post(
        `/:appointmentId/${action}`,
        validateToken,
        authorizeByRole([...managementRoles]),
        appointmentsController.changeCompanyAppointmentStatus(action)
    );
}

export default router;
