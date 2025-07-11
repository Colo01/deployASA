import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import TurnosUser from "./views/TurnosUser";
import General from "./views/General";
import Register from "./views/Register";
import Login from "./views/Login";
import AssistPassword from "./views/AssistPassword";
import RestorePassword from "./views/RestorePassword";
import Users from "./views/Users";
import MyAccount from "./views/MyAccount";
import BranchOffices from "./views/BranchOffices";
import OfficeDetails from "./views/OfficeDetails";
import CreateDeliveryPoint from "./views/CreateDeliveryPoint";
import Welcome from "./views/Welcome";
import MyAppointments from "./views/MyAppointments";
import TurnosOperator from "./views/TurnosOperator";
import Calendar from "./views/Calendar";
import PortalInfo from "./views/PortalInfo";
import Home from "./views/Home";
import HistoricalAppointments from "./views/HistoricalAppointments"; // Nueva importación

import style from "./styles/App.module.css";

function App() {
  const [selectedOffice, setSelectedOffice] = useState({});

  const selectOffice = (office) => {
    setSelectedOffice(office);
  };

  return (
    <div className={style.App}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portalinfo" element={<PortalInfo />} />
        <Route path="/register" element={<Register />} />
        <Route path="/layout" element={<General />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assist_password" element={<AssistPassword />} />
        <Route path="/restore_password" element={<RestorePassword />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/turnos_operator" element={<TurnosOperator />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/myappointments" element={<MyAppointments />} />
        <Route path="/users" element={<Users />} />
        <Route
          path="/appointments_history"
          element={<HistoricalAppointments />}
        />{" "}
        {/* Nueva ruta */}
        <Route
          path="/offices"
          element={<BranchOffices selectOffice={selectOffice} />}
        />
        <Route
          path="/officeDetails"
          element={
            <OfficeDetails
              office={selectedOffice}
              selectOffice={selectOffice}
            />
          }
        />
        <Route path="/createDeliveryPoint" element={<CreateDeliveryPoint />} />
      </Routes>
    </div>
  );
}

export default App;
