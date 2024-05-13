var urlBack = "http://localhost:3000/";

async function registrarConductores() {
  let nombreUsuario = document.getElementById("nombreUsuario").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let apellido = document.getElementById("apellido").value.trim();
  let contrasena = document.getElementById("contrasena").value.trim();

  if (!nombreUsuario || !nombre || !apellido || !contrasena) {
    alert("Por favor complete todos los campos.");
    return;
  }

  let conductor = {
    username: nombreUsuario,
    nombre: nombre,
    apellido: apellido,
    password: contrasena,
  };

  try {
    const request = await fetch(`${urlBack}api/conductores`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(conductor),
    });

    $("#modalAgregarConductor").modal("hide");
    location.reload();
  } catch (error) {
    window.location.href = "http://localhost/DAEM/login.html";
  }
}
