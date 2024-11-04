"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../pages/NavBar';
import Footer from '../../pages/footerSC';
import styles from '../app/home.module.css';

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('');  // Especificar que es un string

  // Definir el objeto de categorías y subcategorías
  const categories: { [key: string]: string[] } = {
    Matematica: ['Algebra', 'Geometria', 'Calculo'],
    Ciencias: ['Fisica_General', 'Quimica_General', 'Ciencias_Naturales'],
    Historia: ['Historia_Antigua', 'Historia_Moderna', 'Historia_Contemporanea'],
    Lenguaje: ['Literatura', 'Gramatica', 'Comprension_Lectora'],
    Programacion: ['Fundamentos_de_Programacion', 'Estructuras_de_Datos', 'Programacion_Orientada_a_Objetos'],
    Física: ['Mecanica_Clasica', 'Electromagnetismo', 'Termodinamica'],
    Química: ['Quimica_Organica', 'Quimica_Inorganica', 'Quimica_Analitica'],
    Biología: ['Biologia_Molecular', 'Genetica', 'Ecologia'],
    Arte: ['Pintura', 'Escultura', 'Dibujo_Artistico'],
    Música: ['Teoria_Musical', 'Composicion', 'Historia_de_la_Musica']
  };

  // Definir las imágenes de las subcategorías
  const subcategoryImages: { [key: string]: string } = {
    Algebra: '/categoria_images/algebra.png',
    Geometria: '/categoria_images/geometria.png',
    Calculo: '/categoria_images/calculo.png',
    Fisica_General: '/categoria_images/fisica.png',
    Quimica_General: '/categoria_images/quimicag.png',
    Ciencias_Naturales: '/categoria_images/ciencia.png',
    Historia_Antigua: '/categoria_images/hantigua.png',
    Historia_Moderna: '/categoria_images/hmoderna.png',
    Historia_Contemporanea: '/categoria_images/hcontemporanea.png',
    Literatura: '/categoria_images/literatura.png',
    Gramatica: '/categoria_images/gramatica.png',
    Comprension_Lectora: '/categoria_images/cmlec.png',
    Fundamentos_de_Programacion: '/categoria_images/programacion.png',
    Estructuras_de_Datos: '/categoria_images/estrucdat.png',
    Programacion_Orientada_a_Objetos: '/categoria_images/prgobj.png',
    Mecanica_Clasica: '/categoria_images/mecanica.png',
    Electromagnetismo: '/categoria_images/electromagnetismo.png',
    Termodinamica: '/categoria_images/termodinamica.png',
    Quimica_Organica: '/categoria_images/organica.png',
    Quimica_Inorganica: '/categoria_images/inorganica.png',
    Quimica_Analitica: '/categoria_images/analitica.png',
    Biologia_Molecular: '/categoria_images/molecularb.png',
    Genetica: '/categoria_images/genetica.png',
    Ecologia: '/categoria_images/ecologia.png',
    Pintura: '/categoria_images/pintura.png',
    Escultura: '/categoria_images/escultura.png',
    Dibujo_Artistico: '/categoria_images/artistico.png',
    Teoria_Musical: '/categoria_images/teoria1.png',
    Composicion: '/categoria_images/teoria1.png',
    Historia_de_la_Musica: '/categoria_images/historiamusica.png'
  };

  // Definir las imágenes de las categorías principales
  const categoryImages: { [key: string]: string } = {
    Matematica: '/categoria_images/mate.png',
    Ciencias: '/categoria_images/ciencia.png',
    Historia: '/categoria_images/historia1.png',
    Lenguaje: '/categoria_images/lenguaje.png',
    Programacion: '/categoria_images/programacion.png',
    Física: '/categoria_images/fisica.png',
    Química: '/categoria_images/quimica.png',
    Biología: '/categoria_images/biologia.png',
    Arte: '/categoria_images/arte.png',
    Música: '/categoria_images/musica.png'
  };

  // Función para manejar el clic en una categoría
  const handleCategoryClick = (category: string) => {
    setCurrentCategory(category);  // Establecer la categoría actual
    setModalOpen(true);  // Abrir el modal
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);  // Cerrar el modal
    setCurrentCategory('');  // Limpiar la categoría seleccionada
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
      <Navbar />
      </header>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Subcategorías de {currentCategory}</h2>
            <ul className={styles.subcategoryList}>
              {/* Mostrar subcategorías de la categoría seleccionada con imágenes */}
              {categories[currentCategory]?.map((subcategory) => (
                <li key={subcategory} className={styles.subcategoryItem}>
                  <Image
                    src={subcategoryImages[subcategory]} // Mostrar la imagen correspondiente
                    alt={subcategory}
                    width={100}
                    height={100}
                  />
                  <p>{subcategory}</p>
                </li>
              ))}
            </ul>
            <button className={styles.closeModalButton} onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <main className={styles.main}>
        <h2 className={styles.subtitle}>Explora tus opciones académicas y servicios</h2>
        <p className={styles.description}>
          "Accede a una amplia gama de cursos, profesores y servicios de apoyo académico.
          Encuentra lo que necesitas para avanzar en tu carrera y mejorar tu experiencia universitaria."
        </p>

        {/* Categorías */}
        <section className={styles.categoriesSection}>
          <h3 className={styles.categoriesTitle}>Categorías Disponibles</h3>
          <div className={styles.categoryGrid}>
            {/* Mapear y mostrar las categorías */}
            {Object.keys(categories).map((category) => (
              <div key={category} className={styles.categoryCard} onClick={() => handleCategoryClick(category)}>
                <Image src={categoryImages[category]} alt={category} width={300} height={100} />
                <p>{category}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer />
    </div>
  );
}