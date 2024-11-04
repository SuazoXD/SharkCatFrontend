import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../pages/styles/register.module.css';

export default function Register() {
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    correo: '',
    contrasenia: '',
    confirmarContrasenia: '',
    edad: '',
    dni: '',
    telefono: '',
    codigoVerificacion: '',
    idRol: 1,
    valoracion: 4.5,
    horarioDiponibleInicio: '09:00:00',
    horarioDisponibleFin: '18:00:00',
  });

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // Estado para manejar los pasos del formulario
  const [message, setMessage] = useState(''); // Estado para mostrar mensajes
  const [showPassword, setShowPassword] = useState(false); // Para mostrar/ocultar contraseñas
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Para mostrar/ocultar confirmación
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar la visibilidad del pop-up
  const [redirectToLogin, setRedirectToLogin] = useState(false); // Estado para mostrar si se redirigirá al login
  const router = useRouter(); // Para manejar redirecciones

  const resetForm = () => {
    setFormData({
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      correo: '',
      contrasenia: '',
      confirmarContrasenia: '',
      edad: '',
      dni: '',
      telefono: '',
      codigoVerificacion: '',
      idRol: 1,
      valoracion: 4.5,
      horarioDiponibleInicio: '09:00:00',
      horarioDisponibleFin: '18:00:00',
    });
  };

  // Validación del primer paso
  const validateFirstStep = () => {
    let errors = {};

    if (!formData.primerNombre.trim()) errors.primerNombre = 'Llena este campo';
    if (!formData.primerApellido.trim()) errors.primerApellido = 'Llena este campo';
    if (!formData.correo.trim()) errors.correo = 'Llena este campo';

    setErrors(errors);
    return Object.keys(errors).length === 0; // Si no hay errores, devolver true
  };

  // Validación del segundo paso (contraseñas)
  const validateSecondStep = () => {
    let errors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_\-]).{8,}$/;

    if (!passwordRegex.test(formData.contrasenia)) {
      errors.contrasenia = 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un símbolo especial';
    }

    if (formData.contrasenia !== formData.confirmarContrasenia) {
      errors.confirmarContrasenia = 'Las contraseñas no coinciden';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validación del tercer paso (información adicional)
  const validateThirdStep = () => {
    let errors = {};

    if (!formData.edad || isNaN(formData.edad)) errors.edad = 'Ingresa una edad válida';
    if (!formData.dni.trim()) errors.dni = 'Llena este campo';
    if (!formData.telefono.trim()) errors.telefono = 'Llena este campo';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();

    if (step === 1 && validateFirstStep()) {
      // Cambiar a step 2 si la validación del primer paso es exitosa
      setStep(2);
    } else if (step === 2 && validateSecondStep()) {
      setStep(3);
    } else if (step === 3 && validateThirdStep()) {
      handleSubmit(e);
    } else {
      setShowPopup(true);
    }
  };

  // Enviar el formulario completo
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      primerNombre: formData.primerNombre,
      segundoNombre: formData.segundoNombre,
      primerApellido: formData.primerApellido,
      segundoApellido: formData.segundoApellido,
      correo: formData.correo,
      contrasenia: formData.contrasenia,
      edad: Number(formData.edad), // Asegúrate de enviar la edad como número
      dni: formData.dni,
      telefono: formData.telefono,
      idRol: Number(formData.idRol),
      valoracion: formData.valoracion, // si es requerido por el backend
      horarioDiponibleInicio: formData.horarioDiponibleInicio, // si es requerido
      horarioDisponibleFin: formData.horarioDisponibleFin, // si es requerido
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/sign-up', dataToSend);
      setMessage('Registro exitoso. Ahora ingrese el código de verificación.');
      setShowPopup(true);
      setStep(4); // Ir al paso de validación del código
    } catch (error) {
      // Mostrar el error detallado en la consola
      console.error('Error en el registro:', error.response ? error.response.data : error);
      setMessage('Error en el registro. Inténtalo de nuevo.');
      setShowPopup(true);
    }
  };

  // Validar código de verificación
  const handleValidateCode = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/sign-up/verify', {
        code: formData.codigoVerificacion,
      });

      if (response.status === 200) {
        setMessage('Código validado correctamente. Redirigiendo al login...');
        setShowPopup(true);

        // Redirige al login después de la validación exitosa
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setMessage('Código incorrecto. Inténtalo de nuevo.');
        setShowPopup(true);
      }
    } catch (error) {
      setMessage('Error al validar el código.');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        {step === 1 && (
          <div className={styles.registerBox}>
            <h1 className={styles.sharkCatTitle}>SharkCat</h1>
            <a href="/" className={styles.homeButton}>
              <img src="/images/home-icon.png" alt="Home" className={styles.homeIcon} />
            </a>
            <img src="/images/Register.png" alt="SharkCat Logo" className={styles.logoImage} />
            <h1 className={styles.title}>Registro de Usuario</h1>
            <h2 className={styles.title}>Datos Básicos</h2>
            <form onSubmit={handleNextStep} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Primer Nombre"
                    value={formData.primerNombre}
                    onChange={(e) => setFormData({ ...formData, primerNombre: e.target.value })}
                    className={styles.input}
                  />
                  {errors.primerNombre && <span className={styles.error}>{errors.primerNombre}</span>}
                </div>

                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Segundo Nombre"
                    value={formData.segundoNombre}
                    onChange={(e) => setFormData({ ...formData, segundoNombre: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Primer Apellido"
                    value={formData.primerApellido}
                    onChange={(e) => setFormData({ ...formData, primerApellido: e.target.value })}
                    className={styles.input}
                  />
                  {errors.primerApellido && <span className={styles.error}>{errors.primerApellido}</span>}
                </div>

                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    placeholder="Segundo Apellido"
                    value={formData.segundoApellido}
                    onChange={(e) => setFormData({ ...formData, segundoApellido: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <input
                type="email"
                placeholder="Correo Electrónico"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                className={styles.input}
              />
              {errors.correo && <span className={styles.error}>{errors.correo}</span>}

              <button type="submit" className={styles.button}>Continuar</button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className={styles.registerBox}>
            <h1 className={styles.sharkCatTitle}>SharkCat</h1>
            <a href="/" className={styles.homeButton}>
              <img src="/images/home-icon.png" alt="Home" className={styles.homeIcon} />
            </a>
            <img src="/images/Register.png" alt="SharkCat Logo" className={styles.logoImage} />
            <h2 className={styles.title}>Contraseñas</h2>
            <form onSubmit={handleNextStep} className={styles.form}>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={formData.contrasenia}
                  onChange={(e) => setFormData({ ...formData, contrasenia: e.target.value })}
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.showPasswordButton}
                >
                  <img
                    src={showPassword ? '/images/eye-close.png' : '/images/eye-open.png'}
                    alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className={styles.eyeIcon}
                  />
                </button>
              </div>
              {errors.contrasenia && <span className={styles.error}>{errors.contrasenia}</span>}

              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Verificar Contraseña"
                  value={formData.confirmarContrasenia}
                  onChange={(e) => setFormData({ ...formData, confirmarContrasenia: e.target.value })}
                  className={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.showPasswordButton}
                >
                  <img
                    src={showConfirmPassword ? '/images/eye-close.png' : '/images/eye-open.png'}
                    alt={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className={styles.eyeIcon}
                  />
                </button>
              </div>
              {errors.confirmarContrasenia && <span className={styles.error}>{errors.confirmarContrasenia}</span>}

              <button type="submit" className={styles.button}>Continuar</button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className={styles.registerBox}>
            <h1 className={styles.sharkCatTitle}>SharkCat</h1>
            <a href="/" className={styles.homeButton}>
              <img src="/images/home-icon.png" alt="Home" className={styles.homeIcon} />
            </a>
            <img src="/images/Register.png" alt="SharkCat Logo" className={styles.logoImage} />
            <h2 className={styles.title}>Información Adicional</h2>
            <form onSubmit={handleNextStep} className={styles.form}>
              <input
                type="number"
                placeholder="Edad"
                value={formData.edad}
                onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                className={styles.input}
              />
              {errors.edad && <span className={styles.error}>{errors.edad}</span>}

              <input
                type="text"
                placeholder="DNI"
                value={formData.dni}
                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                className={styles.input}
              />
              {errors.dni && <span className={styles.error}>{errors.dni}</span>}

              <input
                type="tel"
                placeholder="Número de Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className={styles.input}
              />
              {errors.telefono && <span className={styles.error}>{errors.telefono}</span>}

              <label className={styles.label}>¿Eres Pupilo o Tutor?</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="rol"
                    value="pupilo"
                    checked={formData.idRol === 1}
                    onChange={() => setFormData({ ...formData, idRol: 1 })}
                  />
                  Soy Pupilo
                </label>
                <label className={styles.radioOption}>
                  <input
                    type="radio"
                    name="rol"
                    value="tutor"
                    checked={formData.idRol === 2}
                    onChange={() => setFormData({ ...formData, idRol: 2 })}
                  />
                  Soy Tutor
                </label>
              </div>

              <button type="submit" className={styles.button}>Registrar</button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className={styles.registerBox}>
            <h1 className={styles.title}>Validación de Código</h1>
            <form onSubmit={handleValidateCode} className={styles.form}>
              <input
                type="text"
                placeholder="Inserte código de verificación"
                value={formData.codigoVerificacion}
                onChange={(e) => setFormData({ ...formData, codigoVerificacion: e.target.value })}
                className={styles.input}
              />
              <button type="submit" className={styles.button}>Validar</button>
            </form>
          </div>
        )}
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2>Mensaje</h2>
            <p>{message}</p>
            <button onClick={closePopup} className={styles.closeButton}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
