import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../pages/styles/tutorquestions.module.css'; // Puedes crear un archivo CSS para los estilos de esta página

export default function TutorQuestions() {
  const [questions, setQuestions] = useState([]); // Estado para almacenar las preguntas
  const [selectedQuestionId, setSelectedQuestionId] = useState(null); // Estado para la pregunta seleccionada
  const [offerMessage, setOfferMessage] = useState(''); // Estado para el mensaje de la oferta
  const [responseMessage, setResponseMessage] = useState(''); // Estado para el mensaje de respuesta de la oferta

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setResponseMessage('No estás autenticado.');
      return;
    }

    // Obtener todas las preguntas
    axios
      .get('http://localhost:3000/user/questions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setQuestions(response.data); // Guardar las preguntas en el estado
      })
      .catch((error) => {
        console.error('Error al obtener las preguntas:', error);
      });
  }, []);

  const sendOffer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!token) {
      setResponseMessage('No estás autenticado.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/user/pregunta/send-offer',
        {
          idPregunta: selectedQuestionId,
          descripcion: offerMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setResponseMessage('¡Oferta enviada con éxito!');
        setOfferMessage(''); // Restablecer el mensaje de la oferta después de enviarla
      } else {
        setResponseMessage('Error al enviar la oferta.');
      }
    } catch (error) {
      console.error('Error al enviar la oferta:', error);
      setResponseMessage('Error al enviar la oferta.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Preguntas creadas por pupilos</h1>
      <ul className={styles.questionList}>
        {questions.map((question) => (
          <li key={question.idPregunta} className={styles.questionItem}>
            <p><strong>Título:</strong> {question.titulo}</p>
            <p><strong>Descripción:</strong> {question.descripcion}</p>
            <button onClick={() => setSelectedQuestionId(question.idPregunta)} className={styles.selectButton}>
              Seleccionar para enviar oferta
            </button>
          </li>
        ))}
      </ul>

      {selectedQuestionId && (
        <div className={styles.offerForm}>
          <h2>Enviar oferta de resolución</h2>
          <form onSubmit={sendOffer} className={styles.form}>
            <textarea
              placeholder="Escribe tu mensaje de oferta..."
              value={offerMessage}
              onChange={(e) => setOfferMessage(e.target.value)}
              required
              className={styles.textarea}
            />
            <button type="submit" className={styles.button}>Enviar Oferta</button>
          </form>
        </div>
      )}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
