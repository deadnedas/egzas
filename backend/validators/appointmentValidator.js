const { body, param, query, validationResult } = require("express-validator");

const validate = (validations) => [
  ...validations,
  (req, res, next) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    next();
  },
];

const datesArray = body("dates")
  .optional({ nullable: true })
  .isArray({ min: 1 })
  .withMessage("must be a non-empty array")
  .bail()
  .custom((arr) => {
    const set = new Set(arr);
    if (set.size !== arr.length) throw new Error("dates must be unique");
    const today = new Date().toISOString().slice(0, 10);
    for (const d of arr) {
      if (isNaN(Date.parse(d))) throw new Error(`${d} is not valid ISO date`);
      if (d < today) throw new Error(`${d} is before today`);
    }
    return true;
  })
  .withMessage("each date must be a unique ISO date ≥ today");

module.exports = {
  validateIdParam: validate([
    param("id")
      .exists()
      .withMessage("id is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("id must be a positive integer")
      .toInt(),
  ]),

  validateCreateAppointment: validate([
    body("title")
      .exists()
      .withMessage("title is required")
      .bail()
      .isString()
      .withMessage("must be a string")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("length must be between 3 and 100 characters"),
    body("img_url")
      .exists()
      .withMessage("img_url is required")
      .bail()
      .isURL()
      .withMessage("img_url must be a valid URL"),
    body("duration_minutes")
      .exists()
      .withMessage("duration_minutes is required")
      .bail()
      .isInt({ min: 1, max: 1440 })
      .withMessage("must be an integer between 1 and 1440")
      .toInt(),
    body("price")
      .exists()
      .withMessage("price is required")
      .bail()
      .isFloat({ min: 0.01, max: 10000 })
      .withMessage("must be a number between 0.01 and 10000")
      .toFloat(),
    body("category")
      .exists()
      .withMessage("category is required")
      .bail()
      .isString()
      .withMessage("must be a string")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("length must be between 3 and 50 characters"),
    body("dates").exists().withMessage("dates are required"),
    datesArray,
  ]),

  validateUpdateAppointment: validate([
    param("id")
      .exists()
      .withMessage("id is required")
      .bail()
      .isInt({ gt: 0 })
      .withMessage("id must be a positive integer")
      .toInt(),
    body("title")
      .optional()
      .isString()
      .withMessage("must be a string")
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage("length must be between 3 and 100 characters"),
    body("img_url")
      .optional()
      .isURL({ protocols: ["https"] })
      .withMessage("must be a HTTPS URL")
      .bail()
      .withMessage("must point to a JPG/PNG/GIF image"),
    body("duration_minutes")
      .optional()
      .isInt({ min: 1, max: 1440 })
      .withMessage("must be an integer between 1 and 1440")
      .toInt(),
    body("price")
      .optional()
      .isFloat({ min: 0.01, max: 10000 })
      .withMessage("must be a number between 0.01 and 10000")
      .toFloat(),
    body("category")
      .optional()
      .isString()
      .withMessage("must be a string")
      .trim()
      .isLength({ min: 3, max: 50 })
      .withMessage("length must be between 3 and 50 characters"),
    datesArray,
  ]),

  validateSearch: validate([
    query("name")
      .optional()
      .isString()
      .withMessage("must be a string")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("length must be 1–100 chars"),
    query("date")
      .optional()
      .matches(/^\d{4}(-\d{2})?$/)
      .withMessage("must be YYYY or YYYY-MM or YYYY-MM-DD"),
  ]),
};
