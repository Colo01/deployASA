import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";
import CustomNavbar from "../commons/CustomNavbar";
import axios from "axios";
import style from "../styles/Users.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const HistoricalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user")).data.token;
        const response = await axios.get(
          `${API_URL}/api/admin/appointments/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Historial de turnos recibidos en el frontend:",
          response.data.data
        );

        // Filtrar turnos donde el usuario ha sido eliminado
        const filteredAppointments = response.data.data.filter(
          (appt) => appt.user !== null
        );

        setAppointments(filteredAppointments);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Error al obtener el historial de turnos"
        );
      }
    };

    fetchAppointments();
  }, []);

  const columns = [
    {
      dataField: "user.lname",
      text: "Apellido",
      sort: true,
      filter: textFilter(),
      formatter: (cell) => (cell ? cell : "USUARIO ELIMINADO"),
    },
    {
      dataField: "user.fname",
      text: "Nombre",
      sort: true,
      filter: textFilter(),
      formatter: (cell) => (cell ? cell : "USUARIO ELIMINADO"),
    },
    {
      dataField: "user.dni",
      text: "DNI",
      sort: true,
      filter: textFilter(),
      formatter: (cell) => (cell ? cell : "USUARIO ELIMINADO"),
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
  ];

  const defaultSorted = [
    {
      dataField: "date",
      order: "desc",
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

export default HistoricalAppointments;
