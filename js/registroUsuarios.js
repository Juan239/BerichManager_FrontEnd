  //URL para conectarse al backend
var urlBack = "http://localhost:3000/";


async function registrarUsuarios() {
  let usuario = {
    username: document.getElementById("nombreUsuario").value,
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    password: document.getElementById("contrasena").value, 
    rol: document.getElementById('rolCheckbox').checked

  };

  console.log(usuario);
  try{
    const request = await fetch(`${urlBack}api/usuarios`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(usuario),
    });
  
    // Cerrar el modal
    $("#modalAgregarUsuario").modal("hide");
  
    // Recargar el datatable
    location.reload();
  }catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }

 
}
