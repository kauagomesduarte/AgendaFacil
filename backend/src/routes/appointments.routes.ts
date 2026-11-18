import { Router } from "express";
import * as appointmentsController from "../controllers/appointments.controller.js";
import { createAppointmentSchema } from "../dtos/appointments.dto.js";
import { validate } from "../middlewares/zodValidate.mw.js";
import { validateToken } from "../middlewares/auth.mw.js";

const router = Router();

router.get(
    "/companies/:companyId/availability",
    validateToken,
    appointmentsController.getAvailability
);

router.post(
    "/companies/:companyId/appointments",
    validateToken,
    validate(createAppointmentSchema),
    appointmentsController.requestAppointment
);

router.get(
    "/appointments",
    validateToken,
    appointmentsController.listCustomerAppointments
);

router.get(
    "/appointments/:appointmentId",
    validateToken,
    appointmentsController.getCustomerAppointment
);

router.post(
    "/appointments/:appointmentId/cancel",
    validateToken,
    appointmentsController.cancelCustomerAppointment
);

export default router;
