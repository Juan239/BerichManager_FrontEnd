var urlBack = "http://localhost:3000/";

async function registrarActivos() {
  // Obtener el valor del nombre del activo y eliminar espacios en blanco al principio y al final
  let nombreActivo = document.getElementById("nombreActivo").value.trim();

  // Verificar que el campo no esté vacío después de eliminar los espacios en blanco
  if (!nombreActivo) {
    alert("Por favor ingrese el nombre del activo.");
    return;
  }

  // Crear el objeto activo
  let activo = {
    nombre: nombreActivo,
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

    // Cerrar el modal
    $("#modalAgregarActivo").modal("hide");

    // Recargar la página
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombreActivo").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

$("#nombreActivoEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});
