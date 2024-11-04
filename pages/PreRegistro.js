import { useState } from 'react';
import Navbar from '../pages/Navbar.js';
import Footer from '../pages/Footer';
import styles from '../pages/styles/PreRegistro.module.css';

export default function PreRegistro() {
  const [categoriesSelected, setCategoriesSelected] = useState({
    matematicas: false,
    ciencia: false,
    aprendizajeIdiomas: false,
    sociales: false,
    educacionLinea: false,
    examenes: false,
    ingenieria: false,
    cienciasSociales: false,
    otrasEnsenanzas: false,
  });

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategoriesSelected((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de los datos seleccionados
    console.log("Categorías seleccionadas:", categoriesSelected);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.preRegistroBox}>
        {/* Logo dentro del contenedor de categorías */}
        <img src="/images/logo.png" alt="Logo" className={styles.preRegistroLogo} />

        <h1 className={styles.title}>Como Pupilo deseo</h1>
        <p className={styles.paragraph}>Escoge al menos 3 categorías</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.checkboxGroup}>
            <label>
              <input
                type="checkbox"
                name="matematicas"
                checked={categoriesSelected.matematicas}
                onChange={handleCategoryChange}
              /> 
              Matemáticas
            </label>
            <label>
              <input
                type="checkbox"
                name="ciencia"
                checked={categoriesSelected.ciencia}
                onChange={handleCategoryChange}
              /> 
              Ciencia
            </label>
            <label>
              <input
                type="checkbox"
                name="aprendizajeIdiomas"
                checked={categoriesSelected.aprendizajeIdiomas}
                onChange={handleCategoryChange}
              /> 
              Aprendizaje de Idiomas
            </label>
            <label>
              <input
                type="checkbox"
                name="sociales"
                checked={categoriesSelected.sociales}
                onChange={handleCategoryChange}
              /> 
              Sociales
            </label>
            <label>
              <input
                type="checkbox"
                name="educacionLinea"
                checked={categoriesSelected.educacionLinea}
                onChange={handleCategoryChange}
              /> 
              Educación en Línea
            </label>
            <label>
              <input
                type="checkbox"
                name="examenes"
                checked={categoriesSelected.examenes}
                onChange={handleCategoryChange}
              /> 
              Preparación para Exámenes Oficiales
            </label>
            <label>
              <input
                type="checkbox"
                name="ingenieria"
                checked={categoriesSelected.ingenieria}
                onChange={handleCategoryChange}
              /> 
              Ingeniería
            </label>
            <label>
              <input
                type="checkbox"
                name="cienciasSociales"
                checked={categoriesSelected.cienciasSociales}
                onChange={handleCategoryChange}
              /> 
              Ciencias Sociales
            </label>
            <label>
              <input
                type="checkbox"
                name="otrasEnsenanzas"
                checked={categoriesSelected.otrasEnsenanzas}
                onChange={handleCategoryChange}
              /> 
              Otras enseñanzas
            </label>
          </div>

          <div className={styles.buttons}>
            <button type="button" className={styles.omitirButton}>Omitir</button>
            <button type="submit" className={styles.guardarButton}>Guardar Configuración</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
