import React from "react";
import axios from "axios";
import CustomNavbar from "../commons/CustomNavbar";
import Button from "react-bootstrap/esm/Button";
import parseJwt from "../hooks/parseJwt";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Report } from "notiflix/build/notiflix-report-aio";

import style from "../styles/OfficeDetails.module.css";

const API_URL = process.env.REACT_APP_API_URL;

const CreateDeliveryPoint = () => {
  const token = JSON.parse(localStorage.getItem("user")).data.token;
  const payload = parseJwt(token);
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    axios
      .post(`${API_URL}/api/deliveryPoint/admin/${payload.id}/add`, values)
      .then((res) => {
        console.log("Punto de entrega creado:", res.data);
        Report.success(
          "Se ha creado un nuevo punto de entrega",
          "Ok",
          "Okay",
          () => navigate("/offices")
        );
      })
      .catch((err) => {
        console.error("Error al crear el punto de entrega", err);
        Report.failure("Error", "No se pudo crear el punto de entrega", "Ok");
      });
  };

  const validate = Yup.object({
    address: Yup.string()
      .matches(
        /^(?!^\d+$)[A-Za-z0-9\s]{6,50}$/,
        "Debe tener entre 6 y 50 caracteres y no ser solo números."
      )
      .required("Ingresar una dirección."),
    location: Yup.string()
      .matches(
        /^[A-Za-z\s]{6,50}$/,
        "Debe contener solo letras y entre 6 y 50 caracteres."
      )
      .required("Ingresar una localidad."),
    phone: Yup.string()
      .matches(
        /^\d{10,12}$/,
        "Debe tener entre 10 y 12 dígitos y no contener espacios."
      )
      .required("Ingresar un teléfono válido."),
    email: Yup.string()
      .email("Formato de email inválido.")
      .required("Ingresar un email."),
    startTime: Yup.string().required("Ingresar la hora de apertura."),
    endTime: Yup.string().required("Ingresar la hora de cierre."),
    interval: Yup.number()
      .min(5, "El intervalo debe ser de al menos 5 minutos.")
      .required("Ingresar el intervalo entre turnos."),
  });

  return (
    <>
      <CustomNavbar />
      <div className={style.mainContainer}>
        <Formik
          initialValues={{
            address: "",
            location: "",
            phone: "",
            email: "",
            startTime: "",
            endTime: "",
            interval: 5,
          }}
          validationSchema={validate}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {(formik) => (
            <div className={style.contentContainer}>
              <Form>
                <div className={style.dataContainer}>
                  <div className={style.leftDataContainer}>
                    <div className={style.generalContainer}>
                      <ul>
                        <li>
                          Dirección:&emsp;
                          <div className="form-group">
                            <Field
                              name="address"
                              className="form-control"
                              type="text"
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                        <li>
                          Localidad:&emsp;
                          <div className="form-group">
                            <Field
                              name="location"
                              className="form-control"
                              type="text"
                            />
                            <ErrorMessage
                              name="location"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <ul>
                        <li>
                          Teléfono:&emsp;
                          <div className="form-group">
                            <Field
                              name="phone"
                              className="form-control"
                              type="text"
                            />
                            <ErrorMessage
                              name="phone"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                        <li>
                          E-mail:&emsp;
                          <div className="form-group">
                            <Field
                              name="email"
                              className="form-control"
                              type="email"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className={style.generalContainer}>
                      <ul>
                        <li>
                          Comienza la Distribución:&emsp;
                          <div className="form-group">
                            <Field
                              name="startTime"
                              className="form-control"
                              type="time"
                            />
                            <ErrorMessage
                              name="startTime"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                        <li>
                          Cierra la Distribución:&emsp;
                          <div className="form-group">
                            <Field
                              name="endTime"
                              className="form-control"
                              type="time"
                            />
                            <ErrorMessage
                              name="endTime"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                        <li>
                          Intervalo (minutos):&emsp;
                          <div className="form-group">
                            <Field
                              name="interval"
                              className="form-control"
                              type="number"
                            />
                            <ErrorMessage
                              name="interval"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={style.buttonsContainer}>
                  <div className={style.startButtons}>
                    <Button
                      variant="secondary"
                      className={style.buttons}
                      href="/offices"
                    >
                      <i className="bi bi-arrow-left-circle-fill"></i>
                      &nbsp;&nbsp;Volver
                    </Button>
                  </div>
                  <div className={style.endButtons}>
                    <Button
                      variant="secondary"
                      className={style.buttons}
                      onClick={() => formik.resetForm()}
                    >
                      Borrar formulario
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      className={style.buttons}
                    >
                      Crear Punto de Entrega
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
};

export default CreateDeliveryPoint;
