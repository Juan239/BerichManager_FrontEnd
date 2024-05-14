var urlBack = "http://localhost:3000/";

async function agregarParadas(id) {
  $("#modalParadas").modal("show");

  try {
    const response = await fetch(`${urlBack}api/paradas/${id}`, {
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

    const paradas = await response.json();

    console.log("Paradas: ", paradas);

    if (paradas.length === 0) {
      $("#bodyTablaParadas").empty();
      $("#bodyTablaParadas").append(`
                <tr>
                    <td colspan="7" style="text-align: center;">No hay datos disponibles</td>
                </tr>
            `);
    } else {
      $("#bodyTablaParadas").empty();
      paradas.forEach((parada) => {
        let botonEditar = `<a href="#" onClick="editarParada(${parada.id})" title="Editar parada" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>`;
        let botonEliminar = `<a href="#" onClick="eliminarParada(${parada.id})" title="Eliminar parada" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>`;

        var fechaSalida = parada.pa_fechaSalida;
        var fechaSalidaFormateada = new Date(fechaSalida)
          .toISOString()
          .split("T")[0];
        var fechaLlegada = parada.pa_fechaLlegada;
        var fechaLlegadaFormateada = new Date(fechaLlegada)
          .toISOString()
          .split("T")[0];

        $("#bodyTablaParadas").append(`
            <tr>
                <td>${parada.pa_conductor}</td>
                <td>${fechaSalidaFormateada}</td>
                <td>${parada.pa_kilometrajeSalida}</td>
                <td>${parada.pa_destino}</td>
                <td>${fechaLlegadaFormateada}</td>
                <td>${botonEditar + botonEliminar}</td>
            </tr>
        `);
      });
    }
  } catch (error) {
    alert("Error:", error);
    console.log(error);
  }

  $("#btnAgregarParada")
    .off()
    .click(function () {
      $("#modalParadas").modal("hide");
      $("#modalAgregarParada").modal("show");
      obtenerConductores();
      obtenerDestino();
      obtenerVehiculo();
    });

  $("#btnGuardarParada")
    .off()
    .click(async function () {
      const viaje = id;
      const conductor = $("#conductorParadas").val().trim();
      const fechaSalida = $("#fechaSalidaParadas").val().trim();
      const horaSalida = $("#horaSalidaParadas").val().trim();
      const kilometrajeSalida = $("#kilometrajeSalidaParadas").val().trim();
      const destino = $("#destinoParadas").val().trim();
      const funcionarioTrasladado = $("#funcionarioTrasladadoParadas")
        .val()
        .trim();
      const fechaLlegada = $("#fechaLlegadaParadas").val().trim();
      const horaLlegada = $("#horaLlegadaParadas").val().trim();
      const kilometrajeLlegada = $("#kilometrajeLlegadaParadas").val().trim();
      const combustible = $("#combustibleParadas").val().trim();
      const observaciones = $("#observacionesParadas").val().trim();
      const vehiculo = $("#vehiculoParadas").val().trim();

      if (
        !conductor ||
        !fechaSalida ||
        !horaSalida ||
        !kilometrajeSalida ||
        !destino ||
        !fechaLlegada ||
        !horaLlegada ||
        !kilometrajeLlegada ||
        !vehiculo
      ) {
        alert("Por favor, complete todos los campos.");
        return;
      }

      try {
        const response = await fetch(`${urlBack}api/paradas`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            viaje,
            conductor,
            fechaSalida,
            horaSalida,
            kilometrajeSalida,
            destino,
            funcionarioTrasladado,
            fechaLlegada,
            horaLlegada,
            kilometrajeLlegada,
            combustible,
            observaciones,
            vehiculo,
          }),
        });
      } catch (error) {
        alert("Error al crear la parada");
        console.log(error);
      }

      $("#modalAgregarParada").modal("hide");
      $("#modalParadas").modal("show");
    });
}

/* $("#btnAgregarParada").off().click(function(){
    $("#modalParadas").modal("hide");
    $("#modalAgregarParada").modal("show");
});

$("#btnGuardarParada").off().click(function(){
    $("#modalAgregarParada").modal("hide");
    $("#modalParadas").modal("show");
}); */
