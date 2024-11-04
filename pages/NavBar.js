"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import styles from './styles/navbar.module.css';

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // Estado para el dropdown del perfil

  useEffect(() => {
    // Verificar si el token existe en localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

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

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);

    axios
      .get(`http://localhost:3000/categories/materia/${categoryId}`)
      .then((response) => {
        setMaterias(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener las materias:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Elimina el token del localStorage
    window.location.href = 'http://localhost:3001/login'; // Redirigir al login
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Alternar el menú desplegable
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <Image 
            src="/images/logo2.png"
            alt="Logo de SharkCat"
            width={50}
            height={50}
          />
          <h1 className={styles.navTitle}>SharkCat</h1>

          {/* Botón de Categorías */}
          <div className={styles.dropdown}>
            <button className={styles.dropdownButton}>
              <Image 
                src="/images/categorias.png"
                alt="Categorías"
                width={20}
                height={20}
              /> 
              Categorías
            </button>
            <div className={styles.dropdownContent}>
              {categories.length > 0 ? (
                <ul>
                  {categories.map((category) => (
                    <li key={category.idCategoria}>
                      <button 
                        className={styles.dropdownItem} 
                        onClick={() => handleCategorySelect(category.idCategoria)}
                      >
                        {category.categoria}
                      </button>
                      {selectedCategory === category.idCategoria && materias.length > 0 && (
                        <ul className={styles.submenu}>
                          {materias.map((materia) => (
                            <li key={materia.idMateria}>
                              <Link href="#">
                                {materia.materia}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Cargando categorías...</p>
              )}
            </div>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className={styles.navSearch}>
          <input type="text" placeholder="Buscar" className={styles.searchInput} />
          <button className={styles.searchButton}>
            <Image src="/images/Buscar.png" alt="Buscar" width={16} height={16} />
          </button>
        </div>

        {/* Botones de autenticación */}
        <ul className={styles.authButtons}>
          {isAuthenticated ? (
            <>
              <li>
                {/* Botón de Perfil con menú desplegable */}
                <div className={styles.profileDropdown}>
                  <button className={styles.authButton} onClick={toggleMenu}>
                    <Image src="/images/user.png" alt="Perfil" width={20} height={20} />
                    Perfil
                  </button>
                  {menuVisible && (
                    <div className={styles.profileMenu}>
                      <Link href="/UserProfile">Información Personal</Link>
                      <Link href="/ChangePassword">Cambio de Contraseña</Link>
                      <button onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                  )}
                </div>
              </li>
              <li>
                <Link href="/UserHome">
                  <button className={styles.authButton}>
                    <Image src="/images/home.png" alt="Página Principal" width={20} height={20} />
                    Página Principal
                  </button>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="http://localhost:3001/login">
                  <button className={styles.authButton}>
                    <Image src="/images/iniciar.png" alt="Iniciar Sesión" width={20} height={20} />
                    Iniciar Sesión
                  </button>
                </Link>
              </li>
              <li>
                <Link href="http://localhost:3001/register">
                  <button className={styles.authButton}>
                    <Image src="/images/registe.png" alt="Registrarse" width={20} height={20} />
                    Registrarse
                  </button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
