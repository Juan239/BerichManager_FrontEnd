//URL para conectarse al backend
var urlBack = "http://localhost:3000/";


async function registrarEstablecimiento() {
  let establecimiento = {
    nombre: document.getElementById("nombreEstablecimiento").value,
  };
  try{
    const request = await fetch(`${urlBack}api/establecimientos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(establecimiento),
    });
  
    // Cerrar el modal
    $("#modalAgregarEstablecimientos").modal("hide");
  
    // Recargar el datatable
    location.reload();
  }catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
  
}
