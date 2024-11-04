import { useState } from 'react';
import axios from 'axios';
import styles from '../pages/styles/aggMateria.module.css'; // Asegúrate de crear el archivo de estilos o agregarlo según tus necesidades.

export default function AggMateria() {
  // Estado para almacenar el ID de la materia seleccionada por el usuario
  const [idMateria, setIdMateria] = useState('');
  
  // Estado para mostrar mensajes de éxito o error
  const [message, setMessage] = useState('');

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el token JWT desde localStorage
    const token = localStorage.getItem('access_token');

    // Verificar si el usuario está autenticado (si hay token)
    if (!token) {
      setMessage('No estás autenticado. Redirigiendo al inicio de sesión...');
      
      // Redirigir al login si no está autenticado
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      return;
    }

    try {
      // Realizar la petición al backend para agregar una materia
      const response = await axios.post(
        'http://localhost:3000/user/aggMateria', // La URL del endpoint del backend
        { idMateria: idMateria }, // El cuerpo de la solicitud, con el ID de la materia
        {
          headers: {
            Authorization: `Bearer ${token}` // Enviar el token en los headers para autenticación
          }
        }
      );

      // Si la respuesta es exitosa
      if (response.status === 200) {
        setMessage('Materia agregada con éxito.');
      } else {
        setMessage('Error al agregar la materia. Inténtalo de nuevo.');
      }
    } catch (error) {
      // Manejo de errores
      console.error('Error al agregar la materia:', error);
      setMessage('Error al agregar la materia. Inténtalo de nuevo.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Agregar Materia de Interés</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Campo de entrada para seleccionar el ID de la materia */}
        <label htmlFor="idMateria">Selecciona una materia:</label>
        <input
          type="number" // Solo permite números para el ID de la materia
          placeholder="ID de la materia"
          value={idMateria}
          onChange={(e) => setIdMateria(e.target.value)} // Actualiza el estado con el ID de la materia ingresado
          required
          className={styles.input}
        />
        
        {/* Botón para enviar el formulario */}
        <button type="submit" className={styles.button}>Agregar Materia</button>
      </form>
      
      {/* Mostrar el mensaje de éxito o error */}
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
