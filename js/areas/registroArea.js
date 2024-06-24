var urlBack = "http://localhost:3000/";

async function registrarArea() {
  // Obtener el valor del nombre del área y eliminar espacios en blanco al principio y al final
  let nombreArea = document.getElementById("nombreArea").value.trim();

  // Verificar que el campo no esté vacío después de eliminar los espacios en blanco
  if (!nombreArea) {
    alert("Por favor ingrese el nombre del área.");
    return;
  }

  // Crear el objeto área
  let area = {
    nombre: nombreArea,
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

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombreArea").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

$("#nombreAreaEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});
