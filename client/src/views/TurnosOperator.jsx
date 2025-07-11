import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import CustomNavbar from "../commons/CustomNavbar";
import axios from "axios";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
import style from "../styles/Users.module.css";

const API_URL = process.env.REACT_APP_API_URL;
const TurnosOperator = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user")).data.token;
        const response = await axios.get(`${API_URL}/api/admin/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Datos recibidos en el frontend:", response.data.data);

        // Filtrar usuarios eliminados antes de actualizar el estado
        const filteredAppointments = response.data.data.filter(
          (appt) => appt.user !== null
        );

        setAppointments(filteredAppointments);
      } catch (error) {
        setError(
          error.response?.data?.message || "Error al obtener los turnos"
        );
      }
    };

    fetchAppointments();
  }, []);

  const markAttendance = (id, action) => {
    Confirm.show(
      "Confirmar asistencia",
      `¿Está seguro de marcar el turno como ${action}?`,
      "Sí",
      "No",
      async () => {
        try {
          const token = JSON.parse(localStorage.getItem("user")).data.token;
          await axios.put(
            `${API_URL}/api/admin/appointments/${id}/mark`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setAppointments((prevAppointments) =>
            prevAppointments.filter((appt) => appt._id !== id)
          );
        } catch (error) {
          setError(
            error.response?.data?.message || "Error al actualizar el turno"
          );
        }
      }
    );
  };

  const columns = [
    {
      dataField: "user.lname",
      text: "Apellido",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => row.user?.lname || "USUARIO ELIMINADO",
    },
    {
      dataField: "user.fname",
      text: "Nombre",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => row.user?.fname || "USUARIO ELIMINADO",
    },
    {
      dataField: "user.dni",
      text: "DNI",
      sort: true,
      filter: textFilter(),
      formatter: (cell, row) => {
        console.log("Fila recibida:", row); // Depuración
        if (!row.user) return "USUARIO NO ENCONTRADO";
        if (!row.user.dni) return "SIN REGISTRO";
        return row.user.dni;
      },
    },

    {
      dataField: "date",
      text: "Fecha",
      sort: true,
    },
    {
      dataField: "time",
      text: "Hora",
      sort: true,
    },
    {
      dataField: "state",
      text: "Estado",
      sort: true,
    },
    {
      dataField: "actions",
      text: "Acciones",
      formatter: (_, row) => (
        <div>
          <button
            className={style.attendedBtn}
            onClick={() => markAttendance(row._id, "asistido")}
          >
            Asistido
          </button>
          <button
            className={style.absentBtn}
            onClick={() => markAttendance(row._id, "ausente")}
          >
            Ausente
          </button>
        </div>
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "date",
      order: "asc",
    },
  ];

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <div className={style.contentContainer}>
          {error && <p className={style.error}>{error}</p>}
          <div className={style.tableContainer}>
            <BootstrapTable
              keyField="_id"
              data={appointments}
              columns={columns}
              defaultSorted={defaultSorted}
              filter={filterFactory()}
              pagination={paginationFactory()}
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

export default TurnosOperator;
