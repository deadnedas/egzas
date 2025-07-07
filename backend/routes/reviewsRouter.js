const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createReview,
  getAllReviews,
  getReviewsByAppointmentId,
} = require("../controllers/reviewController");

router.post("/", auth(), createReview);
router.get("/", getAllReviews);
router.get("/appointment/:appointmentId", getReviewsByAppointmentId);

module.exports = router;
