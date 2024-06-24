  //URL para conectarse al backend
var urlBack = "http://localhost:3000/";

document.getElementById("area").addEventListener("change", function() {
  if (this.value == 3) {
    document.getElementById("rolInformaticaCheckbox").checked = false;
    document.getElementById("rolBitacorasCheckbox").checked = false;

    document.getElementById("rolInformaticaCheckbox").disabled = true;
    document.getElementById("rolBitacorasCheckbox").disabled = true;
  } else {
    document.getElementById("rolInformaticaCheckbox").disabled = false;
    document.getElementById("rolBitacorasCheckbox").disabled = false;
  }
});


async function registrarUsuarios() {
  // Obtener los valores de los campos
  let nombreUsuario = document.getElementById("nombreUsuario").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let apellido = document.getElementById("apellido").value.trim();
  let rut = document.getElementById("rut").value.trim();
  let contrasena = document.getElementById("contrasena").value.trim();
  let area = document.getElementById("area").value.trim();

  // Verificar que no haya campos vacíos
  if (!nombreUsuario || !nombre || !apellido || !rut || !contrasena) {
    alert("Por favor complete todos los campos.");
    return;
  }

  // Crear el objeto usuario
  let usuario = {
    username: nombreUsuario,
    nombre: nombre,
    apellido: apellido,
    rut: rut,
    password: contrasena,
    rolInformatica: document.getElementById('rolInformaticaCheckbox').checked,
    rolBitacoras: document.getElementById('rolBitacorasCheckbox').checked,
    area : area
  };

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

// ----------------------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombre").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 25) {
    $(this).val(inputValue.slice(0, 25));
  }
});

$("#apellido").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 25) {
    $(this).val(inputValue.slice(0, 25));
  }
});

$("#nombreEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 25) {
    $(this).val(inputValue.slice(0, 25));
  }
});

$("#apellidoEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 25) {
    $(this).val(inputValue.slice(0, 25));
  }
});

$("#rut").on("input", function () {
  var regex = /^[0-9Kk-]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^0-9Kk-]/g, ""));
  }
  if (inputValue.length > 10) {
    $(this).val(inputValue.slice(0, 10));
  }
});

$("#rutEditar").on("input", function () {
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
  var regex = /^[a-zA-Z\s]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\s]/g, ""));
  }
  if (inputValue.length > 25) {
    $(this).val(inputValue.slice(0, 25));
  }
});

$("#nombreUsuarioEditar").on("input", function () {
  var regex = /^[a-zA-Z\s]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\s]/g, ""));
  }
  if (inputValue.length > 25) {
    $(this).val(inputValue.slice(0, 25));
  }
});

