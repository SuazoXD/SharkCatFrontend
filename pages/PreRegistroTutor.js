import { useState } from 'react';
import Navbar from '../pages/Navbar.js';
import Footer from '../pages/FooterSC';
import styles from '../pages/styles/PreRegistro.module.css';

const categoriesByTab = {
  Ciencia: ['Matemáticas', 'Ciencia', 'Física', 'Química', 'Biología'],
  Ingenieria: [
    'Ingeniería', 'Ingeniería Eléctrica', 'Ingeniería Mecánica', 'Ingeniería Civil', 
    'Electricidad', 'Energía Solar', 'Electrónica'
  ],
  Idiomas: [
    'Idioma Inglés', 'Idioma Alemán', 'Idioma Francés', 'Idioma Español', 
    'Gramática Inglesa', 'Vocabulario en Inglés', 'Conversación en Inglés'
  ],
  Sociales: [
    'Ciencias Sociales', 'Psicología', 'Criminología', 'Psicoterapia', 
    'Historia del Arte', 'Filosofía', 'Terapias Cognitivo-Conductuales'
  ],
  'Formación Profesional': [
    'Formación Posgrado', 'Preparación para Exámenes Oficiales', 
    'Certified Professional Coder (CPC)', 'Codificación Médica', 'Facturación Médica'
  ],
  'Otras Enseñanzas': [
    'Escritura Creativa', 'Estadística', 'Análisis de Inteligencia', 'La Biblia', 
    'Literatura Inglesa', 'Gestión de Proyectos', 'Diseño Educativo', 
    'Creación de Cursos en Línea'
  ]
};

export default function PreRegistroTutor() {
  const [categoriesSelected, setCategoriesSelected] = useState({});
  const [activeTab, setActiveTab] = useState('Ciencia');
  const [searchTerm, setSearchTerm] = useState('');

  const handleCategoryChange = (e) => {
    const { name, checked } = e.target;
    setCategoriesSelected((prev) => ({
      ...prev,
      [name]: { ...prev[name], selected: checked },
    }));
  };

  const handleDiplomaUpload = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setCategoriesSelected((prev) => ({
        ...prev,
        [name]: { ...prev[name], diploma: files[0] },
      }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCategories = (tab) => {
    return categoriesByTab[tab].filter((category) =>
      category.toLowerCase().includes(searchTerm)
    );
  };

  const renderTabContent = () => {
    const currentCategories = filteredCategories(activeTab);
    return (
      <div className={styles.checkboxGroup}>
        {currentCategories.map((category) => (
          <div key={category}>
            <label>
              <input
                type="checkbox"
                name={category}
                checked={categoriesSelected[category]?.selected || false}
                onChange={handleCategoryChange}
              />
              {category}
            </label>
            {categoriesSelected[category]?.selected && (
              <div className={styles.uploadBox}>
                <input
                  type="file"
                  name={category}
                  onChange={handleDiplomaUpload}
                  accept=".pdf, .jpg, .png"
                />
                {categoriesSelected[category]?.diploma && (
                  <p>{categoriesSelected[category].diploma.name}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Categorías seleccionadas:", categoriesSelected);
    // Aquí puedes manejar el envío de datos
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.preRegistroBox}>
        <img src="/images/logo.png" alt="Logo" className={styles.preRegistroLogo} />

        <h1 className={styles.title}>Termina Configuración como Tutor</h1>
        <p className={styles.paragraph}>Escoge las categorías que enseñas y sube tu diploma para cada una:</p>

        <input
          type="text"
          placeholder="Buscar categorías"
          className={styles.searchBar}
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <div className={styles.tabs}>
          <button onClick={() => setActiveTab('Ciencia')} className={activeTab === 'Ciencia' ? styles.activeTab : ''}>Ciencia</button>
          <button onClick={() => setActiveTab('Ingenieria')} className={activeTab === 'Ingenieria' ? styles.activeTab : ''}>Ingeniería</button>
          <button onClick={() => setActiveTab('Idiomas')} className={activeTab === 'Idiomas' ? styles.activeTab : ''}>Idiomas</button>
          <button onClick={() => setActiveTab('Sociales')} className={activeTab === 'Sociales' ? styles.activeTab : ''}>Ciencias Sociales</button>
          <button onClick={() => setActiveTab('Formación Profesional')} className={activeTab === 'Formación Profesional' ? styles.activeTab : ''}>Formación Profesional</button>
          <button onClick={() => setActiveTab('Otras Enseñanzas')} className={activeTab === 'Otras Enseñanzas' ? styles.activeTab : ''}>Otras Enseñanzas</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {renderTabContent()}

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
