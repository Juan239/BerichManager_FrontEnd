var urlBack = "http://localhost:3000/";

async function registrarConductores() {
  let nombreUsuario = document.getElementById("nombreUsuario").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let apellido = document.getElementById("apellido").value.trim();
  let rut = document.getElementById("rutConductor").value.trim();
  let contrasena = document.getElementById("contrasena").value.trim();

  if (!nombreUsuario || !nombre || !apellido || !contrasena || !rut) {
    alert("Por favor complete todos los campos.");
    return;
  }

  let conductor = {
    username: nombreUsuario,
    nombre: nombre,
    apellido: apellido,
    rut: rut,
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

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombre").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#apellido").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#rutConductor").on("input", function () {
  var regex = /^[0-9Kk-]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^0-9Kk-]/g, ""));
  }
  if (inputValue.length > 10) {
    $(this).val(inputValue.slice(0, 10));
  }
});

$("#nombreUsuario").on("input", function () {
  var regex = /^[a-zA-Z0-9]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z0-9]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});


//

$("#nombreEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#apellidoEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#rutConductorEditar").on("input", function () {
  var regex = /^[0-9Kk-]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^0-9Kk-]/g, ""));
  }
  if (inputValue.length > 10) {
    $(this).val(inputValue.slice(0, 10));
  }
});

$("#nombreUsuarioEditar").on("input", function () {
  var regex = /^[a-zA-Z0-9]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z0-9]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});