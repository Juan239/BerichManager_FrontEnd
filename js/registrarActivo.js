var urlBack = "http://localhost:3000/";

async function registrarActivos() {
  let activo = {
    nombre: document.getElementById("nombreActivo").value,
  };
  try {
    const request = await fetch(`${urlBack}api/tipoActivos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(activo),
    });
    $("#modalAgregarActivo").modal("hide");
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}
