const Appointment = require("../models/appointmentModel");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.getAll();
    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.getById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    res
      .status(500)
      .json({ message: "Failed to get appointment", error: error.message });
  }
};

const createAppointment = async (req, res) => {
  const { title, img_url, duration_minutes, price, dates, category } = req.body;
  if (
    !title ||
    !img_url ||
    !duration_minutes ||
    !price ||
    !Array.isArray(dates)
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const appointment = await Appointment.create({
      title,
      img_url,
      duration_minutes,
      price,
      category,
      dates,
    });
    res.status(201).json({ appointment });
  } catch (err) {
    console.error("Error creating appointment:", err);
    res
      .status(500)
      .json({ message: "Error creating appointment", error: err.message });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { title, img_url, duration_minutes, price, category, dates } = req.body;

  try {
    const appointment = await Appointment.update(id, {
      title,
      img_url,
      duration_minutes,
      price,
      category,
      dates,
    });
    res.json({ appointment });
  } catch (err) {
    console.error("Update appointment error:", err);
    res
      .status(500)
      .json({ message: "Failed to update appointment", error: err.message });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Appointment.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({
      message: "Appointment deleted successfully",
      appointment: deleted,
    });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    res
      .status(500)
      .json({ message: "Error deleting appointment", error: err.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
