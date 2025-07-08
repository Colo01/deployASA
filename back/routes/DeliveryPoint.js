// api/routes/DeliveryPoint.js

const express = require("express");
const router = express.Router();
const DeliveryPoint = require("../models/DeliveryPoint");
const Appointment = require("../models/Appointment");

// Obtener todas las Campañas
router.get("/", async (req, res) => {
  try {
    const deliveryPoints = await DeliveryPoint.find().populate("appointments");
    if (!deliveryPoints || deliveryPoints.length === 0) {
      return res.status(404).json({ error: "No hay Campaña registradas." });
    }
    res.status(200).json({ data: deliveryPoints });
  } catch (error) {
    console.error("Error al obtener Campaña:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Crear una nueva Campaña
router.post("/admin/:adminId/add", async (req, res) => {
  const {
    location,
    address,
    phone,
    email,
    startTime,
    endTime,
    interval = 5,
  } = req.body;

  try {
    const newDeliveryPoint = new DeliveryPoint({
      location,
      address,
      phone,
      email,
      startTime,
      endTime,
    });

    const savedDeliveryPoint = await newDeliveryPoint.save();

    const startMinutes =
      parseInt(startTime.split(":")[0]) * 60 +
      parseInt(startTime.split(":")[1]);
    const endMinutes =
      parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

    const appointments = [];
    for (let time = startMinutes; time < endMinutes; time += interval) {
      const hour = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
      const minute = (time % 60).toString().padStart(2, "0");

      appointments.push({
        date: new Date().toISOString().split("T")[0],
        time: `${hour}:${minute}`,
        availableSlots: 1,
        deliveryPoint: savedDeliveryPoint._id,
        available: true, // IMPORTANTE
        state: "disponible", // IMPORTANTE
      });
    }

    const createdAppointments = await Appointment.insertMany(appointments);
    savedDeliveryPoint.appointments = createdAppointments.map((app) => app._id);
    await savedDeliveryPoint.save();

    res.status(201).json({
      message: "Campaña creada con turnos generados",
      data: savedDeliveryPoint,
    });
  } catch (error) {
    console.error("Error al crear Campaña:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

// Eliminar Campaña
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPoint = await DeliveryPoint.findByIdAndDelete(id);
    if (!deletedPoint) {
      return res.status(404).json({ error: "Campaña no encontrada." });
    }
    res.status(200).json({ message: "Campaña eliminada con éxito." });
  } catch (error) {
    console.error("Error al eliminar Campaña:", error.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
