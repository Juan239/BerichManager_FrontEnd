var urlBack = "http://localhost:3000/";

function abrirModal(){
    $("#modalAgregarTipoRecomendacion").modal("show");

}

async function registrarTipoRecomendacion(){
    let nombre = document.getElementById("nombreTipoRecomendacion").value.trim();

    if(!nombre){
        alert("Por favor ingrese el nombre del tipo de recomendación.");
        return;
    }

    try{
        const response = await fetch(`${urlBack}api/tipoRecomendaciones`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre: nombre
            })
        });

        $("#modalAgregarTipoRecomendacion").modal("hide");
        location.reload();
    }catch(error){
        console.error("Error:", error.message);
        window.location.href = "http://localhost/DAEM/login.html";
    }
}

$("#nombreTipoRecomendacion").on("input", function () {
    var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
    var inputValue = $(this).val();
    if (!regex.test(inputValue)) {
      $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
    }
    if (inputValue.length > 50) {
      $(this).val(inputValue.slice(0, 50));
    }
  });

  $("#nombreTipoRecomendacionEditar").on("input", function () {
    var regex = /^[a-zA-Z\sáéíóúÁÉÍÓÚ]*$/;
    var inputValue = $(this).val();
    if (!regex.test(inputValue)) {
      $(this).val(inputValue.replace(/[^a-zA-Z\sáéíóúÁÉÍÓÚ]/g, ""));
    }
    if (inputValue.length > 50) {
      $(this).val(inputValue.slice(0, 50));
    }
  });