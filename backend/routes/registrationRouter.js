const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createRegistration,
  getAllRegistrations,
  getRegistrationsByAppointmentId,
  getRegistrationsByUserId,
  updateRegistrationStatus,
  updateRegistrationDate,
  cancelRegistration,
} = require("../controllers/registrationController");

const {
  validateCreateRegistration,
  validateUpdateStatus,
  validateUpdateDate,
  validateCancel,
  validateGetByAppointmentId,
  validateGetByUserId,
} = require("../validators/registrationValidator");

router.post("/", auth(), validateCreateRegistration, createRegistration);
router.get("/", auth("admin"), getAllRegistrations);

router.get(
  "/appointment/:appointmentId",
  auth("admin"),
  validateGetByAppointmentId,
  getRegistrationsByAppointmentId
);

router.get(
  "/user/:userId",
  auth(),
  validateGetByUserId,
  getRegistrationsByUserId
);

router.patch(
  "/status/:registrationId",
  auth("admin"),
  validateUpdateStatus,
  updateRegistrationStatus
);

router.patch(
  "/date/:registrationId",
  auth(),
  validateUpdateDate,
  updateRegistrationDate
);

router.delete("/:registrationId", auth(), validateCancel, cancelRegistration);

module.exports = router;
