const Registration = require("../models/registrationModel");

const createRegistration = async (req, res) => {
  const { appointmentDateId } = req.body;
  if (!appointmentDateId)
    return res
      .status(400)
      .json({ message: "Please provide appointmentDateId" });

  try {
    const registration = await Registration.create({
      userId: req.user.id,
      appointmentDateId,
    });
    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.getAll();
    res.status(200).json({
      status: "success",
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrationsByAppointmentId = async (req, res) => {
  const { appointmentId } = req.params;
  try {
    const registrations = await Registration.getByAppointmentId(appointmentId);
    res.status(200).json({
      status: "success",
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRegistrationsByUserId = async (req, res) => {
  const { userId } = req.params;
  if (req.user.role !== "admin" && Number(userId) !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Forbidden: cannot access other users' registrations" });
  }

  try {
    const registrations = await Registration.getByUserId(userId);
    if (registrations.length === 0) {
      return res.status(200).json({
        status: "success",
        count: 0,
        data: [],
        message: "No appointment history found",
      });
    }
    res.status(200).json({
      status: "success",
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointment history",
      error: error.message,
    });
  }
};

const updateRegistrationStatus = async (req, res) => {
  const { registrationId } = req.params;
  const { status } = req.body;

  if (!["pending", "approved"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const registration = await Registration.updateStatus(
      registrationId,
      status
    );
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
    res.status(200).json({ status: "success", data: registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRegistrationDate = async (req, res) => {
  const { registrationId } = req.params;
  const { appointmentDateId } = req.body;
  if (!appointmentDateId)
    return res
      .status(400)
      .json({ message: "Please provide appointmentDateId" });

  try {
    const registration = await Registration.getById(registrationId);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
    if (registration.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: not your registration" });
    }

    const updated = await Registration.updateDate(
      registrationId,
      appointmentDateId
    );
    res.status(200).json({ status: "success", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  const { registrationId } = req.params;
  try {
    const registration = await Registration.getById(registrationId);
    if (!registration)
      return res.status(404).json({ message: "Registration not found" });
    if (registration.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: not your registration" });
    }

    await Registration.delete(registrationId);
    res.status(200).json({
      status: "success",
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationsByAppointmentId,
  getRegistrationsByUserId,
  updateRegistrationStatus,
  updateRegistrationDate,
  cancelRegistration,
};
