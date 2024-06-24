//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarMarcas() {
  // Obtener el valor del nombre de la marca y eliminar espacios en blanco al principio y al final
  let nombreMarca = document.getElementById("nombreMarca").value.trim();

  // Verificar que el campo no esté vacío después de eliminar los espacios en blanco
  if (!nombreMarca) {
    alert("Por favor ingrese el nombre de la marca.");
    return;
  }

  // Crear el objeto marca
  let marca = {
    nombre: nombreMarca,
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

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombreMarca").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

$("#nombreMarcaEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});
