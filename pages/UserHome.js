import { useEffect, useState } from 'react';
import Navbar from './NavBar';
import Footer from './footerSC';
import styles from './styles/userhome.module.css';
import axios from 'axios';

export default function UserHome() {
  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [offerDescription, setOfferDescription] = useState({});
  const [nuevaPregunta, setNuevaPregunta] = useState(null); // Estado para almacenar la nueva pregunta

  // Estados para los inputs del formulario de pupilo
  const [idMateria, setIdMateria] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idEstadoPregunta, setIdEstadoPregunta] = useState(1);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      setToken(storedToken);
      fetchUserRole(storedToken);
    } else {
      setError('No se encontró un token válido.');
    }
  }, []);

  const fetchUserRole = async (token) => {
    try {
      const response = await axios.get('http://localhost:3000/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserRole(response.data.rol.rol.toLowerCase());
    } catch (error) {
      setError('Error al obtener el rol del usuario.');
    }
  };

  const fetchPreguntas = async () => {
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:3000/user/pregunta/interes-tutor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPreguntas(response.data);
    } catch (error) {
      setError('Error al obtener los datos');
    }
  };

  useEffect(() => {
    if (token && userRole === 'tutor') {
      fetchPreguntas();
    }
  }, [token, userRole]);

  const handleSendOffer = async (idPregunta) => {
    const descripcion = offerDescription[idPregunta] || "";
    if (!descripcion) {
      setError('Debes ingresar una propuesta.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/user/pregunta/send-offer',
        {
          idPregunta,
          descripcion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOfferDescription((prevState) => ({ ...prevState, [idPregunta]: "" }));
      }
    } catch (error) {
      setError('Error al enviar la propuesta.');
    }
  };

  const handleInputChange = (idPregunta, value) => {
    setOfferDescription((prevState) => ({
      ...prevState,
      [idPregunta]: value,
    }));
  };

  // Función para manejar el envío del formulario de pupilo
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar si hay token
    if (!token) {
      console.log('No se encontró un token válido para enviar la pregunta.');
      setError('No se encontró un token válido.');
      return;
    }
  
    try {
      console.log('Enviando pregunta...');
      const response = await axios.post(
        'http://localhost:3000/user/pregunta/add',
        {
          idMateria: parseInt(idMateria), // Convertir a número
          titulo,
          descripcion,
          idEstadoPregunta, // Valor fijo como en el ejemplo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) { // Chequear si la respuesta es exitosa
        console.log('Pregunta agregada con éxito:', response.data);
        setPreguntas((prevPreguntas) => [...prevPreguntas, response.data]); // Agregar la pregunta al estado
        setError('Pregunta agregada con éxito.');
        resetForm(); // Limpiar el formulario después de agregar
      } else {
        console.log('Error inesperado en la respuesta:', response);
        setError('Ocurrió un error inesperado al agregar la pregunta.');
      }
    } catch (error) {
      console.error('Error al agregar la pregunta:', error);
      setError('Error al agregar la pregunta.');
    }
  };
  

  const resetForm = () => {
    setIdMateria('');
    setTitulo('');
    setDescripcion('');
  };
  
  return (
    <div className={styles.container}>
      <Navbar />
  
      <main className={styles.mainContent}>
        <h1>Bienvenido a SharkCat</h1>
        <p>Explora tus opciones académicas y encuentra ayuda con nuestros tutores.</p>
  
        {error && <p className={styles.error}>{error}</p>}
  
        {userRole === 'pupilo' ? (
          <div className={styles.formContainer}>
            <h2>Agregar una nueva pregunta</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="idMateria">ID Materia:</label>
              <input 
                type="number" 
                id="idMateria" 
                value={idMateria}
                onChange={(e) => setIdMateria(e.target.value)}
                required 
              />
              
              <label htmlFor="titulo">Título:</label>
              <input 
                type="text" 
                id="titulo" 
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required 
              />
  
              <label htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
  
              <button type="submit" className={styles.submitButton}>Agregar Pregunta</button>
            </form>
  
            {/* Mostrar la pregunta recién agregada */}
            {preguntas.length > 0 && (
              <div className={styles.preguntasContainer}>
                <h3>Pregunta recién agregada:</h3>
                <div key={preguntas[preguntas.length - 1].idPregunta} className={styles.pregunta}>
                  <p><strong>ID Usuario Pupilo:</strong> {preguntas[preguntas.length - 1].idUsuarioPupilo}</p>
                  <p><strong>Título:</strong> {preguntas[preguntas.length - 1].titulo}</p>
                  <p><strong>Descripción:</strong> {preguntas[preguntas.length - 1].descripcion}</p>
                  <p><strong>Fecha de Publicación:</strong> {new Date(preguntas[preguntas.length - 1].fechaPublicacion).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        ) : userRole === 'tutor' ? (
          <div className={styles.preguntasContainer}>
            <h2>Preguntas de Pupilos</h2>
            {preguntas.length > 0 ? (
              preguntas.map((pregunta) => (
                <div key={pregunta.idPregunta} className={styles.pregunta}>
                  <p><strong>ID Usuario Pupilo:</strong> {pregunta.idUsuarioPupilo}</p>
                  <p><strong>Título:</strong> {pregunta.titulo}</p>
                  <p><strong>Descripción:</strong> {pregunta.descripcion}</p>
                  <p><strong>Fecha de Publicación:</strong> {new Date(pregunta.fechaPublicacion).toLocaleDateString()}</p>
  
                  <div className={styles.offerForm}>
                    <input
                      type="text"
                      placeholder="Escribe tu propuesta aquí..."
                      value={offerDescription[pregunta.idPregunta] || ""}
                      onChange={(e) => handleInputChange(pregunta.idPregunta, e.target.value)}
                      className={styles.input}
                    />
                    <button
                      onClick={() => handleSendOffer(pregunta.idPregunta)}
                      className={styles.submitButton}
                    >
                      Enviar Propuesta
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No se encontraron preguntas.</p>
            )}
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </main>
  
      <Footer />
    </div>
  );
}  
