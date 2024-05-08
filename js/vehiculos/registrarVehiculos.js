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
