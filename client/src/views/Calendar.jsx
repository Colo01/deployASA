// client/src/views/Calendar.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import Button from "react-bootstrap/Button";
import CustomNavbar from "../commons/CustomNavbar";
import filterFactory from "react-bootstrap-table2-filter";
import style from "../styles/Calendar.module.css";
import { Report } from "notiflix/build/notiflix-report-aio";
import { useNavigate } from "react-router-dom";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

const Calendar = () => {
  const [offices, setOffices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const token = JSON.parse(localStorage.getItem("user"))?.data?.token;
  const navigate = useNavigate();

  useEffect(() => {
    loadOffices();
  }, []);

  useEffect(() => {
    if (selectedOffice) {
      console.log("📌 Campaña seleccionada:", selectedOffice);
      loadAppointments(selectedOffice._id);
    } else {
      console.warn("⚠ No se ha seleccionado ninguna Campaña.");
    }
  }, [selectedOffice]);

  const loadOffices = () => {
    axios
      .get("http://localhost:5000/api/deliveryPoint", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Campañas cargadas:", res.data.data);
        setOffices(res.data.data);
      })
      .catch((err) => console.error("❌ Error al cargar Campañas:", err));
  };

  const loadAppointments = (officeId) => {
    if (!officeId) {
      console.warn("⚠ No hay una Campaña seleccionada.");
      return;
    }

    console.log("📌 Cargando turnos para la Campaña:", officeId);

    axios
      .get(
        `http://localhost:5000/api/availableAppointments?deliveryPointId=${officeId}`, // ✅ Ruta corregida
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log("✅ Turnos cargados:", res.data.data);
        const appointmentsData = res.data.data.map((appointment) => ({
          id: appointment._id,
          date: appointment.date,
          time: appointment.time,
          state: appointment.state,
          actions: (
            <Button
              variant="primary"
              onClick={() => handleReserve(appointment._id)}
            >
              Reservar Turno
            </Button>
          ),
        }));
        setAppointments(appointmentsData);
      })
      .catch((err) => {
        console.error("❌ Error al cargar turnos:", err);
        console.log("Detalles del error:", err.response?.data || err.message);
      });
  };

  const handleReserve = async (appointmentId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.data?.id;

    if (!userId || !appointmentId) {
      Report.failure(
        "Error",
        "No se pudo reservar el turno. Faltan datos requeridos.",
        "Ok"
      );
      return;
    }

    Confirm.show(
      "Confirmar Reserva",
      "¿Está seguro de que desea reservar este turno?",
      "Sí",
      "No",
      async () => {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/admin/appointments/reserve", // 🔥 RUTA CORREGIDA
            { userId, appointmentId },
            { headers: { Authorization: `Bearer ${user.data.token}` } }
          );

          Report.success(
            "Reserva Exitosa",
            "Recibirás un correo con los detalles del turno",
            response.data.message,
            "Ir a Mis Turnos",
            () => navigate("/myappointments")
          );

          if (selectedOffice) loadAppointments(selectedOffice._id);
        } catch (error) {
          const errorMsg =
            error.response?.data?.error || "Error al reservar turno.";
          Report.failure("Error", errorMsg, "Ok");
          console.error("❌ Error al reservar turno:", error);
        }
      }
    );
  };

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          <h2 style={{ textAlign: "center", color: "#4a1c07" }}>
            Calendario de Turnos
          </h2>
          <select
            className="form-select"
            onChange={(e) =>
              setSelectedOffice(offices.find((o) => o._id === e.target.value))
            }
            style={{ margin: "20px 0", padding: "10px" }}
          >
            <option value="">Selecciona una Campaña de Distribución</option>
            {offices.map((office) => (
              <option key={office._id} value={office._id}>
                {office.location} - {office.address}
              </option>
            ))}
          </select>
          <div className={style.tableContainer}>
            <BootstrapTable
              keyField="id"
              data={appointments}
              columns={[
                {
                  dataField: "date",
                  text: "Fecha",
                  headerAlign: "center",
                  align: "center",
                },
                {
                  dataField: "time",
                  text: "Hora",
                  headerAlign: "center",
                  align: "center",
                },
                {
                  dataField: "state",
                  text: "Estado",
                  headerAlign: "center",
                  align: "center",
                },
                {
                  dataField: "actions",
                  text: "Acciones",
                  headerAlign: "center",
                  align: "center",
                },
              ]}
              pagination={paginationFactory()}
              filter={filterFactory()}
              striped
              hover
              condensed
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
