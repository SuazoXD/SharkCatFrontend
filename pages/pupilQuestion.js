import { useState } from 'react';
import axios from 'axios';
import styles from '../pages/styles/pupilask.module.css'; // Puedes crear un archivo CSS para los estilos de esta página

export default function CreateQuestion() {
  const [idMateria, setIdMateria] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idEstadoPregunta, setIdEstadoPregunta] = useState(1); // Estado predeterminado
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); // Obtener el token del pupilo

    if (!token) {
      setResponseMessage('No estás autenticado.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/user/pregunta/add',
        {
          idMateria,
          titulo,
          descripcion,
          idEstadoPregunta
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Enviar el token en los headers
          }
        }
      );

      if (response.status === 200) {
        setResponseMessage('¡Pregunta creada con éxito!');
        setIdMateria('');
        setTitulo('');
        setDescripcion('');
        setIdEstadoPregunta(1); // Restablecer los valores después de crear la pregunta
      } else {
        setResponseMessage('Error al crear la pregunta. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al crear la pregunta:', error);
      setResponseMessage('Error al crear la pregunta. Inténtalo de nuevo.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Crear una nueva pregunta</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="number"
          placeholder="ID de la materia"
          value={idMateria}
          onChange={(e) => setIdMateria(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Título de la pregunta"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          className={styles.input}
        />
        <textarea
          placeholder="Descripción de la pregunta"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          className={styles.textarea}
        />
        <input
          type="number"
          placeholder="ID del estado de la pregunta"
          value={idEstadoPregunta}
          onChange={(e) => setIdEstadoPregunta(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Crear Pregunta</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
