function logout() {
    // Eliminar los datos del local storage
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('idUsuario');
    
    // Redirigir a la página de inicio de sesión
    window.location.href = 'http://localhost/DAEM/login.html'; // Cambia 'pagina_de_inicio_de_sesion.html' por la URL deseada
}