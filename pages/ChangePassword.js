import { useState, useEffect } from 'react'; 
import axios from 'axios';
import styles from '../pages/styles/change-password.module.css';
import { Html } from 'next/document';

export default function ChangePassword() {
  const [userId, setUserId] = useState(''); // Eliminamos el campo de ID de usuario
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo de confirmación de contraseña
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // Mostrar/ocultar nueva contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Mostrar/ocultar confirmación
  const [showPopup, setShowPopup] = useState(false); // Estado para controlar el pop-up

  // Usar el useEffect para obtener el userId desde localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar que la nueva contraseña y la confirmación coincidan
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      setShowPopup(true);
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:3000/auth/pass-update/${userId}`, {
        oldPassword,
        newPassword
      });
      setMessage('Contraseña actualizada con éxito.');
      setShowPopup(true); // Mostrar el pop-up con el mensaje de éxito
    } catch (error) {
      setMessage('Error al actualizar la contraseña.');
      setShowPopup(true); // Mostrar el pop-up con el mensaje de error
    }
  };

  const closePopup = () => {
    setShowPopup(false); // Ocultar el pop-up cuando se cierre
  };

  return (
    <div className={styles.container}>
      <div className={styles.passwordBox}>
        <h1 className={styles.sharkCatTitle}>SharkCat</h1>
        <a href="/" className={styles.homeButton}>
          <img src="/images/home-icon.png" alt="Home" className={styles.homeIcon} />
        </a>
        <img src="/images/Contraseina.png" alt="SharkCat Logo" className={styles.logoImage} />
        <h1 className={styles.title}>Cambiar Contraseña</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input 
            type="password" 
            placeholder="Contraseña Antigua" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            required 
            className={styles.input}
          />

          {/* Nueva contraseña con botón de mostrar/ocultar */}
          <div className={styles.passwordContainer}>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className={styles.showPasswordButton}
            >
              <img
                src={showNewPassword ? "/images/eye-close.png" : "/images/eye-open.png"}
                alt={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className={styles.eyeIcon}
              />
            </button>
          </div>

          {/* Confirmar contraseña con botón de mostrar/ocultar */}
          <div className={styles.passwordContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar Nueva Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.showPasswordButton}
            >
              <img
                src={showConfirmPassword ? "/images/eye-close.png" : "/images/eye-open.png"}
                alt={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className={styles.eyeIcon}
              />
            </button>
          </div>

          <button type="submit" className={styles.button}>Actualizar Contraseña</button>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>

      {/* Ventana emergente (pop-up) */}
      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>{message}</p>
            <button onClick={closePopup} className={styles.closeButton}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
