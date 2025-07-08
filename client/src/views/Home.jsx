// client/src/views/Home.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/Home.module.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={style.homeContainer}>
      {/* Navbar */}
      <nav className={style.navbar}>
        <div className={style.leftSection}>
          {/* Logo */}
          <img
            src={require("../images/3.png")}
            alt="Logo"
            className={style.logo}
          />
          {/* Texto "Bienvenidos" */}
          <span className={style.userGreeting}>Bienvenidos</span>
        </div>

        <div className={style.buttons}>
          <button onClick={() => navigate("/login")} className={style.loginBtn}>
            Ingresar
          </button>
          <button
            onClick={() => navigate("/register")}
            className={style.registerBtn}
          >
            Registrarse
          </button>
        </div>
      </nav>

      <div className={style.contenedor}>
        {/* Overlay con blur */}
        <div className={style.blurOverlay}></div>

        <div className={style.wrap}>
          <div className={style.box}>
            <span>Te damos la bienvenida a</span>
            <h1>ACCIÓN SOLIDARIA ADVENTISTA</h1>
            <p>
              Nuestra misión es brindar apoyo a quienes más lo necesitan, cada
              mes gracias a la generosidad de nuestros benefactores, entregamos
              bolsas de alimentos no perecederos y productos de limpieza a los
              estudiantes de la Universidad Adventista del Plata que se
              encuentran en situación de necesidad.{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
