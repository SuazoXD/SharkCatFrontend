import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './NavBar';
import Footer from './footerSC';
import styles from './styles/userprofile.module.css';

export default function UserProfile() {
  const [userDetails, setUserDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newCoverPhoto, setNewCoverPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const savedProfilePicture = localStorage.getItem('profile_picture');
    const savedCoverPhoto = localStorage.getItem('cover_photo');
    const savedUserDetails = localStorage.getItem('user_details');

    if (savedProfilePicture) {
      setNewProfilePicture(savedProfilePicture);
    }
    if (savedCoverPhoto) {
      setNewCoverPhoto(savedCoverPhoto);
    }
    if (savedUserDetails) {
      setUserDetails(JSON.parse(savedUserDetails));
    }

    if (!token) {
      setMessage('No estás autenticado. Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
      return;
    }

    axios
      .get('http://localhost:3000/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserDetails(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
        setMessage('Error al obtener los detalles del perfil.');
      });
  }, []);

  const handleFieldEdit = (field, value) => {
    const updatedUserDetails = { ...userDetails };
    if (field.includes('.')) {
      const keys = field.split('.');
      updatedUserDetails[keys[0]][keys[1]] = value;
    } else {
      updatedUserDetails[field] = value;
    }
    setUserDetails(updatedUserDetails);
    localStorage.setItem('user_details', JSON.stringify(updatedUserDetails));
  };

  const handleProfileUpdate = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('No se encontró un token válido.');
      return;
    }

    try {
      const response = await axios.patch(
        'http://localhost:3000/user/update-info',
        {
          primerNombre: userDetails?.nombre?.primerNombre,
          segundoNombre: userDetails?.nombre?.segundoNombre,
          primerApellido: userDetails?.nombre?.primerApellido,
          segundoApellido: userDetails?.nombre?.segundoApellido,
          edad: userDetails?.edad,
          dni: userDetails?.dni,
          telefono: userDetails?.telefono,
          horarioDisponibleInicio: userDetails?.horarioDisponibleInicio,
          horarioDisponibleFin: userDetails?.horarioDisponibleFin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert('Perfil actualizado con éxito.');
      } else {
        alert('Error al actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      alert('Error al actualizar el perfil.');
    }
  };

  const renderRating = (rating) => {
    return '⭐'.repeat(rating);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, rating }]);
      setNewComment('');
      setRating(0);
    }
  };

  if (message) {
    return (
      <div className={styles.messageContainer}>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.mainContent}>
        <div className={styles.coverPhotoContainer}>
          <img
            src={newCoverPhoto ? newCoverPhoto : '/images/perfil/portada.jpg'}
            alt="Foto de Portada"
            className={styles.coverPhoto}
          />
          <div className={styles.centeredInputContainer}>
            <input type="file" onChange={(e) => handleCoverPhotoChange(e)} className={styles.fileInput} />
          </div>
        </div>

        <div className={styles.centeredProfileContainer}>
          <div className={styles.profileContainer}>
            {userDetails ? (
              <>
                <div className={styles.profileHeader}>
                  <div className={styles.profileImageContainer}>
                    <img
                      src={
                        newProfilePicture
                          ? newProfilePicture
                          : '/images/perfil/perfil.png'
                      }
                      alt="Foto de Perfil"
                      className={styles.profileImage}
                    />
                    <div className={styles.centeredInputContainer}>
                      <input type="file" onChange={(e) => handleProfilePictureChange(e)} className={styles.fileInput} />
                    </div>
                  </div>
                  <h3 className={styles.profileName}>
                    {`${userDetails.nombre.primerNombre} ${userDetails.nombre.primerApellido}`} {userDetails.rol.rol === 'tutor' ? '👩‍🏫' : '🎓'}
                  </h3>
                </div>

                <div className={styles.profileDetailsContainer}>
                  <h2>Información básica:</h2>
                  <div className={styles.profileDetails}>
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={userDetails.nombre.primerNombre}
                      onChange={(e) =>
                        handleFieldEdit('nombre.primerNombre', e.target.value)
                      }
                    />
                    <label>Apellido</label>
                    <input
                      type="text"
                      value={userDetails.nombre.primerApellido}
                      onChange={(e) =>
                        handleFieldEdit('nombre.primerApellido', e.target.value)
                      }
                    />
                    <label>Edad</label>
                    <input
                      type="number"
                      value={userDetails.edad}
                      onChange={(e) => handleFieldEdit('edad', e.target.value)}
                    />
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={userDetails.telefono}
                      onChange={(e) => handleFieldEdit('telefono', e.target.value)}
                    />
                    <label>Horario Disponible</label>
                    <input
                      type="time"
                      value={new Date(userDetails.horarioDisponibleInicio)
                        .toISOString()
                        .substr(11, 5)}
                      onChange={(e) =>
                        handleFieldEdit(
                          'horarioDisponibleInicio',
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="time"
                      value={new Date(userDetails.horarioDisponibleFin)
                        .toISOString()
                        .substr(11, 5)}
                      onChange={(e) =>
                        handleFieldEdit('horarioDisponibleFin', e.target.value)
                      }
                    />
                    <button onClick={handleProfileUpdate} className={styles.saveButton}>
                      Guardar Información
                    </button>
                  </div>
                </div>

                {userDetails.rol.rol === 'tutor' && (
                  <div className={styles.commentsSection}>
                    <h2>Valoración: {renderRating(userDetails.valoracion)}</h2>
                    <div className={styles.commentInputContainer}>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario..."
                        className={styles.commentInput}
                      />
                      <div className={styles.ratingContainer}>
                        <label>Valoración:</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        />
                      </div>
                      <button
                        onClick={handleCommentSubmit}
                        className={styles.submitCommentButton}
                      >
                        Añadir Comentario
                      </button>
                    </div>
                    <div className={styles.commentsList}>
                      {comments.map((comment, index) => (
                        <div key={index} className={styles.commentItem}>
                          <p>{comment.text}</p>
                          <p>{renderRating(comment.rating)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p>Cargando detalles del perfil...</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
