var urlBack = "http://localhost:3000/";

async function registrarVehiculo() {
  let patente = document.getElementById("patenteVehiculo").value.trim();
  let marca = document.getElementById("marcaVehiculo").value.trim();
  let modelo = document.getElementById("modeloVehiculo").value.trim();

  if (!patente || !marca || !modelo) {
    alert("Por favor complete todos los campos.");
    return;
  }

  let vehiculo = {
    patente: patente,
    marca: marca,
    modelo: modelo,
  };

  try {
    const request = await fetch(`${urlBack}api/vehiculos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehiculo),
    });
    if (!request.ok) {
      const error = await request.json();
      throw new Error(error.message);
    }
    
    $("#modalAgregarVehiculos").modal("hide");
    location.reload();
  } catch (error) {
    alert(error.message);
  }
}

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#patenteVehiculo").on("input", function () {
  var inputValue = $(this).val(); // Obtiene el valor de la entrada

  // Remueve todos los caracteres que no sean letras, números o guiones
  inputValue = inputValue.replace(/[^a-zA-Z0-9-]/g, '');

  // Convierte el valor de la entrada a mayúsculas
  inputValue = inputValue.toUpperCase();

  // Limita el valor de la entrada a 8 caracteres
  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, 8);
  }

  // Establece el valor de la entrada nuevamente con las modificaciones
  $(this).val(inputValue);
});

$("#marcaVehiculo").on("input", function () {
  var regex = /^[a-zA-Z\s]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\s]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#modeloVehiculo").on("input", function () {
  var regex = /^[a-zA-Z0-9\s]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z0-9\s]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#patenteVehiculoEditar").on("input", function () {
  var inputValue = $(this).val(); // Obtiene el valor de la entrada

  // Remueve todos los caracteres que no sean letras, números o guiones
  inputValue = inputValue.replace(/[^a-zA-Z0-9-]/g, '');

  // Convierte el valor de la entrada a mayúsculas
  inputValue = inputValue.toUpperCase();

  // Limita el valor de la entrada a 8 caracteres
  if (inputValue.length > 8) {
    inputValue = inputValue.slice(0, 8);
  }

  // Establece el valor de la entrada nuevamente con las modificaciones
  $(this).val(inputValue);
});

$("#marcaVehiculoEditar").on("input", function () {
  var regex = /^[a-zA-Z\s]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\s]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});

$("#modeloVehiculoEditar").on("input", function () {
  var regex = /^[a-zA-Z0-9\s]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z0-9\s]/g, ""));
  }
  if (inputValue.length > 30) {
    $(this).val(inputValue.slice(0, 30));
  }
});
