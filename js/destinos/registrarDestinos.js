var urlBack = "http://localhost:3000/";

async function registrarDestino() {
  let nombreDestino = document.getElementById("nombreDestino").value.trim();

  if (!nombreDestino) {
    alert("Por favor ingrese el nombre del destino.");
    return;
  }

  let destino = {
    nombre: nombreDestino,
  };

  try {
    const request = await fetch(`${urlBack}api/destinos`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(destino),
    });

    $("#modalAgregarDestinos").modal("hide");

    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//------------------------------------------------Validacion de campos--------------------------------------------------------------
$("#nombreDestino").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});

$("#nombreDestinoEditar").on("input", function () {
  var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
  var inputValue = $(this).val();
  if (!regex.test(inputValue)) {
    $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
  }
  if (inputValue.length > 50) {
    $(this).val(inputValue.slice(0, 50));
  }
});