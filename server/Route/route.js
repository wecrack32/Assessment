const express = require("express");
const { registerUser } = require("../controller/Register.controller");
const {
  getDashboardStats,
  getAllRegistrations,
} = require("../controller/Admin.controller");

const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.status(200).json({ message: "Conference Registration API is running" });
});

router.post("/register", registerUser);

router.get("/admin/stats", getDashboardStats);
router.get("/admin/registrations", getAllRegistrations);

module.exports = router;
