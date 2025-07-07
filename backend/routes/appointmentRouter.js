const express = require("express");
const auth = require("../middleware/auth");
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");
const {
  validateIdParam,
  validateCreateAppointment,
  validateUpdateAppointment,
} = require("../validators/appointmentValidator");

const router = express.Router();

router.get("/all", getAllAppointments);
router.get("/:id", validateIdParam, getAppointmentById);

router.post("/", auth("admin"), validateCreateAppointment, createAppointment);
router.patch(
  "/:id",
  auth("admin"),
  validateUpdateAppointment,
  updateAppointment
);
router.delete("/:id", auth("admin"), validateIdParam, deleteAppointment);

module.exports = router;
