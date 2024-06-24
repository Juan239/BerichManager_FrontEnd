//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarCategoria() {
  // Obtener el valor del nombre de la categoría y eliminar espacios en blanco al principio y al final
  let nombreCategoria = document.getElementById("nombreCategoria").value.trim();

  // Verificar que el campo no esté vacío después de eliminar los espacios en blanco
  if (!nombreCategoria) {
    alert("Por favor ingrese el nombre de la categoría.");
    return;
  }

  // Crear el objeto categoría
  let categoria = {
    nombre: nombreCategoria,
  };

  try {
    const request = await fetch(`${urlBack}api/categorias`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoria),
    });

    // Cerrar el modal
    $("#modalAgregarCategorias").modal("hide");

    // Recargar el datatable
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombreCategoria").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

$("#nombreCategoriaEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

