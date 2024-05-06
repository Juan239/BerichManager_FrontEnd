//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarMarcas() {
  let marca = {
    nombre: document.getElementById("nombreMarca").value,
  };
  try {
    const request = await fetch(`${urlBack}api/marcas`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(marca),
    });

    // Cerrar el modal
    $("#modalAgregarMarcas").modal("hide");

    // Recargar el datatable
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}