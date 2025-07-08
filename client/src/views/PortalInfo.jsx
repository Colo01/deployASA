import React from "react";
import style from "../styles/Portal.module.css";
import { Link } from "react-router-dom";

const PortalInfo = () => {
  return (
    <div className={style.faqcontainer}>
      <h2 className={style.faqtitle}>Preguntas Frecuentes</h2>

      <div className={style.faqitem}>
        <p className={style.faqquestion}>
          1. ¿Cómo puedo registrarme en el sistema?
        </p>
        <p className={style.faqanswer}>
          Para registrarte, simplemente accede a la página principal del portal
          ASA y selecciona la opción "Registrarse". Deberás completar tus datos
          personales y confirmar tu cuenta.
        </p>
      </div>

      <div className={style.faqitem}>
        <p className={style.faqquestion}>
          2. ¿Cómo puedo sacar un turno en una Campaña?
        </p>
        <p className={style.faqanswer}>
          Una vez hayas iniciado sesión, accede a la sección de "Campañaes" y
          selecciona la Campaña deseada. Luego, elige la fecha y el horario
          disponibles para agendar tu turno.
        </p>
      </div>

      <div className={style.faqitem}>
        <p className={style.faqquestion}>
          3. ¿Qué debo hacer si olvidé mi contraseña?
        </p>
        <p className={style.faqanswer}>
          En la pantalla de inicio de sesión, selecciona la opción "¿Olvidaste
          tu contraseña?". Sigue los pasos para restablecerla mediante tu correo
          electrónico.
        </p>
      </div>
      <p>
        Volver al Home <Link to="/Login">Home</Link>
      </p>
    </div>
  );
};

export default PortalInfo;
