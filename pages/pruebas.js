import { useEffect } from 'react';

export default function Home() {

  useEffect(() => {
    // Cargar el SDK de Google cuando el componente se monta
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Esperar a que el SDK de Google esté cargado antes de inicializar el botón
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '668809977447-cbtd3g6so9rr4m8hr6e9gbsfet7kqnc2.apps.googleusercontent.com',
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large' } // Personaliza el botón
        );
      } else {
        console.error('Error al cargar el SDK de Google');
      }
    };

    // Depurar si el script no se carga correctamente
    script.onerror = () => {
      console.error('No se pudo cargar el SDK de Google');
    };
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Token de Google:', response.credential);
    const userInfo = parseJwt(response.credential);
    console.log('Correo electrónico:', userInfo.email);

    // Generar un código de verificación si es necesario
    const verificationCode = generateVerificationCode();
    alert(`Tu código de verificación es: ${verificationCode}`);
  };

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div id="google-signin-button"></div>
    </div>
  );
}
