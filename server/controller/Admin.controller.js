const Registration = require("../model/register.model");

/**
 * GET DASHBOARD STATS
 * - Total registrations
 * - Student count
 * - Professional count
 */
const getDashboardStats = async (req, res) => {
  try {
    const total = await Registration.countDocuments();

    const students = await Registration.countDocuments({
      registration_type: "student",
    });

    const professionals = await Registration.countDocuments({
      registration_type: "professional",
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        students,
        professionals,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

/**
 * GET ALL REGISTRATIONS
 * Supports:
 * - Filter by type (all / student / professional)
 * - Sort by date (asc / desc)
 */
const getAllRegistrations = async (req, res) => {
  try {
    const { type = "all", sort = "desc" } = req.query;

    const filter =
      type !== "all" ? { registration_type: type } : {};

    const sortOrder = sort === "asc" ? 1 : -1;

    const registrations = await Registration.find(filter)
      .sort({ createdAt: sortOrder })
      .select(
        "name email registration_type company phone createdAt"
      );

    res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error("Fetch Registrations Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations",
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllRegistrations,
};