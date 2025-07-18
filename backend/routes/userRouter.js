const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  getUserById,
  logout,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/", auth("admin"), getAllUsers);
router.get("/:id", auth("admin"), getUserById);

module.exports = router;
