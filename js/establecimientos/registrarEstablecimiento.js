//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarEstablecimiento() {
  // Obtener el valor del nombre del establecimiento y eliminar espacios en blanco al principio y al final
  let nombreEstablecimiento = document
    .getElementById("nombreEstablecimiento")
    .value.trim();

  // Verificar que el campo no esté vacío después de eliminar los espacios en blanco
  if (!nombreEstablecimiento) {
    alert("Por favor ingrese el nombre del establecimiento.");
    return;
  }

  // Crear el objeto establecimiento
  let establecimiento = {
    nombre: nombreEstablecimiento,
  };

  try {
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
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombreEstablecimiento").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

$("#nombreEstablecimientoEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

