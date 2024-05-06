var urlBack = "http://localhost:3000/";

async function registrarArea() {
  let area = {
    nombre: document.getElementById("nombreArea").value,
  };
  try {
    const request = await fetch(`${urlBack}api/areas`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(area),
    });

    // Cerrar el modal
    $("#modalAgregarAreas").modal("hide");

    // Recargar el datatable
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}