"use client"; // Indica que es un componente cliente

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../pages/styles/Footer.module.css";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Obtener las categorías desde el backend
    axios
      .get('http://localhost:3000/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
      });
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Categorías alineadas a la izquierda */}
        <div className={styles.categories}>
          <h4 className={styles.tituloCategoria}>Categorías Académicas</h4>
          {categories.length > 0 ? (
            categories.map((category) => (
              <p key={category.idCategoria} className={styles.categoriaTexto}>
                <a href="#" className={styles.categoriaEnlace}>
                  {category.categoria}
                </a>
              </p>
            ))
          ) : (
            <p className={styles.categoriaTexto}>Cargando categorías...</p>
          )}
        </div>

        {/* Redes sociales alineadas a la derecha */}
        <div className={styles.social}>
          <ul className={styles.socialGrid}>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Facebook_logo_%28square%29.png" alt="Facebook" className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI-h-e2hgz8mwGfCt4gvj4IgMG_wAUolVM6w&s" alt="Twitter" className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <img src="https://img.icons8.com/color/512/linkedin.png" alt="LinkedIn" className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" alt="YouTube" className={styles.socialIcon} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Texto de derechos reservados centrado */}
      <p className={styles.copyright}>© {new Date().getFullYear()} Shark Cat. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;
