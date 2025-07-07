const { body, param, validationResult } = require("express-validator");

const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
];

module.exports = {
  validateCreateRegistration: validate([
    body("appointmentDateId")
      .exists()
      .withMessage("appointmentDateId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("appointmentDateId must be a positive integer")
      .toInt(),
  ]),

  validateUpdateStatus: validate([
    param("registrationId")
      .exists()
      .withMessage("registrationId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("registrationId must be a positive integer")
      .toInt(),
    body("status")
      .exists()
      .withMessage("status is required")
      .bail()
      .isIn(["pending", "approved"])
      .withMessage("status must be 'pending' or 'approved'"),
  ]),

  validateUpdateDate: validate([
    param("registrationId")
      .exists()
      .withMessage("registrationId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("registrationId must be a positive integer")
      .toInt(),
    body("appointmentDateId")
      .exists()
      .withMessage("appointmentDateId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("appointmentDateId must be a positive integer")
      .toInt(),
  ]),

  validateCancel: validate([
    param("registrationId")
      .exists()
      .withMessage("registrationId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("registrationId must be a positive integer")
      .toInt(),
  ]),

  validateGetByAppointmentId: validate([
    param("appointmentId")
      .exists()
      .withMessage("appointmentId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("appointmentId must be a positive integer")
      .toInt(),
  ]),

  validateGetByUserId: validate([
    param("userId")
      .exists()
      .withMessage("userId is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("userId must be a positive integer")
      .toInt(),
  ]),
};
