  //URL para conectarse al backend
var urlBack = "http://localhost:3000/";


async function registrarUsuarios() {
  // Obtener los valores de los campos
  let nombreUsuario = document.getElementById("nombreUsuario").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let apellido = document.getElementById("apellido").value.trim();
  let contrasena = document.getElementById("contrasena").value.trim();

  // Verificar que no haya campos vacíos
  if (!nombreUsuario || !nombre || !apellido || !contrasena) {
    alert("Por favor complete todos los campos.");
    return;
  }

  // Crear el objeto usuario
  let usuario = {
    username: nombreUsuario,
    nombre: nombre,
    apellido: apellido,
    password: contrasena,
    rolInformatica: document.getElementById('rolInformaticaCheckbox').checked,
    rolBitacoras: document.getElementById('rolBitacorasCheckbox').checked,
  };

  console.log(usuario);
  try {
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
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

