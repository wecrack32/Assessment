const Registration = require("../model/register.model");

/**
 * Register Student or Professional (MongoDB)
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, registration_type, company, phone } = req.body;

    if (!name || !email || !registration_type) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and registration type are required",
      });
    }

    if (
      registration_type === "professional" &&
      (!company || company.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Company is required for professional registration",
      });
    }

    await Registration.create({
      name,
      email,
      registration_type,
      company: registration_type === "professional" ? company : undefined,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while registering user",
    });
  }
};

module.exports = {
  registerUser,
};