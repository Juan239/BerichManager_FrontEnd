var urlBack = "http://localhost:3000/";

async function registrarViaje() {
  // Obtener los valores de los campos de entrada
  const conductor = parseInt(document.getElementById("conductor").value);
  const fechaSalida = document.getElementById("fechaSalida").value;
  const horaSalida = document.getElementById("horaSalida").value;
  const kilometrajeSalida = parseInt(
    document.getElementById("kilometrajeSalida").value
  );
  const destino = parseInt(document.getElementById("destino").value);
  const funcionarioTrasladado = document
    .getElementById("funcionarioTrasladado")
    .value.trim();
  const vehiculo = document.getElementById("vehiculo").value;

  // Verificar que ningún campo esté vacío
  if (
    !conductor ||
    !fechaSalida ||
    !horaSalida ||
    !kilometrajeSalida ||
    !destino
  ) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  console.log("Conductor: ", conductor);
  console.log("Fecha de salida: ", fechaSalida);
  console.log("Hora de salida: ", horaSalida);
  console.log("Kilometraje de salida: ", kilometrajeSalida);
  console.log("Destino: ", destino);
  console.log("Funcionario trasladado: ", funcionarioTrasladado);
  console.log("Vehículo: ", vehiculo);

  if (token) {
    try {
      // Obtener datos del usuario
      const response = await fetch(`${urlBack}api/credenciales`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Acceso no autorizado");
      }

      const data = await response.json();

      const viaje = {
        conductor,
        fechaSalida,
        horaSalida,
        kilometrajeSalida,
        destino,
        funcionarioTrasladado,
        vehiculo,
      };

      // Enviar solicitud al backend
      const request = await fetch(`${urlBack}api/bitacoras`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(viaje),
      });

      // Verificar si la solicitud fue exitosa
      if (request.ok) {
        console.log("Viaje registrado con éxito:");
        $("#modalAgregarViaje").modal("hide");
        location.reload();
      } else {
        throw new Error("Error al registrar el viaje");
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  } else {
    console.error("No se encontró ningún token almacenado.");
  }
}


