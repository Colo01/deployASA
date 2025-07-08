const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const DeliveryPoint = require("../models/DeliveryPoint");
const parseId = require("../utils/functions");
require("dotenv").config();
const { sendAppointmentEmail } = require("../utils/send_email_service"); // Servicio de envío de correos

/* 
 📌 Rutas disponibles:
 (1) Obtener turnos disponibles para un punto de entrega
 (2) Reservar un turno por el usuario
 (3) Mostrar turnos de un usuario
 (4) Mostrar turnos de un usuario
 (5) Obtener historial de turnos
*/

// (1) Obtener turnos disponibles para un punto de entrega
router.get("/availableAppointments", async (req, res) => {
  const { deliveryPointId } = req.query;
  console.log("📌 deliveryPointId recibido:", deliveryPointId);

  if (!deliveryPointId) {
    return res
      .status(400)
      .json({ error: "ID del punto de entrega requerido." });
  }

  try {
    const appointments = await Appointment.find({
      deliveryPoint: deliveryPointId,
      state: "disponible",
    }).populate("deliveryPoint", "location address");

    console.log("✅ Turnos encontrados:", appointments);

    res.status(200).json({ data: appointments });
  } catch (err) {
    console.error("❌ Error al obtener turnos disponibles:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// (2) Reservar un turno por el usuario
router.post("/reserve", async (req, res) => {
  const { userId, appointmentId } = req.body;

  if (!userId || !appointmentId) {
    return res.status(400).json({ error: "Faltan datos requeridos." });
  }

  try {
    // Buscar el turno
    const appointment = await Appointment.findById(appointmentId).populate(
      "deliveryPoint"
    );

    if (!appointment) {
      return res.status(404).json({ error: "Turno no encontrado." });
    }

    if (appointment.state !== "disponible") {
      return res.status(400).json({ error: "El turno no está disponible." });
    }

    // Validar si el usuario ya tiene un turno reservado para esta Campaña
    const user = await User.findById(userId).populate("appointment");
    const hasTurnForThisBranch = user.appointment.some(
      (appt) =>
        appt.deliveryPoint.toString() ===
        appointment.deliveryPoint._id.toString()
    );

    if (hasTurnForThisBranch) {
      return res.status(400).json({
        error: "Ya tienes un turno reservado para esta campaña.",
      });
    }

    // Actualizar el estado del turno
    appointment.user = userId;
    appointment.state = "reservado";
    await appointment.save();

    // Agregar el turno al array de 'appointment' del usuario
    user.appointment.push(appointmentId);
    await user.save();

    // Enviar correo de confirmación de turno
    await sendAppointmentEmail(user.email, {
      id: appointment._id.toString(),
      date: appointment.date,
      time: appointment.time,
      state: appointment.state,
      branch: appointment.deliveryPoint.address,
    });

    res.status(200).json({ message: "Turno reservado exitosamente." });
  } catch (err) {
    console.error("Error al reservar turno:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// (3) Mostrar turnos de un usuario
router.get("/:id/showAppointments", async (req, res) => {
  const { id } = req.params;

  try {
    const appointments = await Appointment.find({ user: id }).populate(
      "deliveryPoint",
      "location address"
    );

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No hay turnos registrados para este usuario." });
    }

    res.status(200).json({ data: appointments });
  } catch (err) {
    console.error("Error al obtener los turnos del usuario:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// (4) Mostrar turnos de un usuario
router.get("/myAppointments", async (req, res) => {
  const { userId } = req.query; // Usa query params para obtener el ID del usuario
  if (!userId) {
    return res.status(400).json({ error: "El ID del usuario es requerido." });
  }

  try {
    const appointments = await Appointment.find({ user: userId }).populate(
      "deliveryPoint",
      "location address"
    );

    if (!appointments.length) {
      return res
        .status(404)
        .json({ message: "No hay turnos registrados para este usuario." });
    }

    res.status(200).json({ data: appointments });
  } catch (error) {
    console.error("Error al obtener los turnos:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// (5) Obtener historial de turnos (todos los turnos registrados) ✅ FIXED
router.get("/history", async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: { $ne: null } }) // Filtra usuarios eliminados
      .populate("user", "fname lname dni")
      .populate("deliveryPoint", "location address");

    console.log(
      "Historial de turnos enviados por la API (sin usuarios eliminados):",
      JSON.stringify(appointments, null, 2)
    );

    res.status(200).json({ data: appointments });
  } catch (err) {
    console.error("Error al obtener el historial de turnos:", err);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
