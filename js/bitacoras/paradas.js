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
        let botonEditar = `<a href="#" onClick="editarParada(${parada.pa_id})" title="Editar parada" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>`;
        let botonEliminar = `<a href="#" onClick="eliminarParada(${parada.pa_id})" title="Eliminar parada" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>`;

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
                <td>${parada.conductor}</td>
                <td>${fechaSalidaFormateada}</td>
                <td>${parada.pa_kilometrajeSalida} km</td>
                <td>${parada.destino}</td>
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

  $("#btnCancelarParada")
    .off()
    .click(function () {
      $("#modalAgregarParadas").modal("hide");
      $("#modalParadas").modal("show");
    });

  $("#btnCancelarParadaEditar")
    .off()
    .click(function () {
      $("#modalAgregarParadasEditar").modal("hide");
      $("#modalParadas").modal("show");
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

async function editarParada(id) {
  $("#modalParadas").modal("hide");
  $("#modalEditarParada").modal("show");
  obtenerConductores();
  obtenerDestino();
  obtenerVehiculo();

  try {
    const responseParadas = await fetch(`${urlBack}api/parada/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!responseParadas.ok) {
      throw new Error("Acceso no autorizado");
    }

    const parada = await responseParadas.json();

    var fechaSalida = new Date(parada[0].pa_fechaSalida);
    var fechaLlegada = new Date(parada[0].pa_fechaLlegada);

    var fechaSalidaFormateada = fechaSalida.toISOString().split("T")[0];
    var fechaLlegadaFormateada = fechaLlegada.toISOString().split("T")[0];

    document.getElementById("conductorParadasEditar").value =
      parada[0].pa_conductor;
    document.getElementById("fechaSalidaParadasEditar").value =
      fechaSalidaFormateada;
    document.getElementById("horaSalidaParadasEditar").value =
      parada[0].pa_horaSalida;
    document.getElementById("kilometrajeSalidaParadasEditar").value =
      parada[0].pa_kilometrajeSalida;
    document.getElementById("destinoParadasEditar").value =
      parada[0].pa_destino;
    document.getElementById("funcionarioTrasladadoParadasEditar").value =
      parada[0].pa_funcionarioTrasladado;
    document.getElementById("fechaLlegadaParadasEditar").value =
      fechaLlegadaFormateada;
    document.getElementById("horaLlegadaParadasEditar").value =
      parada[0].pa_horaLlegada;
    document.getElementById("kilometrajeLlegadaParadasEditar").value =
      parada[0].pa_kilometrajeLlegada;
    document.getElementById("combustibleParadasEditar").value =
      parada[0].pa_combustible;
    document.getElementById("observacionesParadasEditar").value =
      parada[0].pa_observaciones;
    document.getElementById("vehiculoParadasEditar").value =
      parada[0].pa_vehiculo;

    $("#btnGuardarParadaEditar")
      .off()
      .click(async function () {
        const conductor = $("#conductorParadasEditar").val().trim();
        const fechaSalida = $("#fechaSalidaParadasEditar").val().trim();
        const horaSalida = $("#horaSalidaParadasEditar").val().trim();
        const kilometrajeSalida = $("#kilometrajeSalidaParadasEditar")
          .val()
          .trim();
        const destino = $("#destinoParadasEditar").val().trim();
        const funcionarioTrasladado = $("#funcionarioTrasladadoParadasEditar")
          .val()
          .trim();
        const fechaLlegada = $("#fechaLlegadaParadasEditar").val().trim();
        const horaLlegada = $("#horaLlegadaParadasEditar").val().trim();
        const kilometrajeLlegada = $("#kilometrajeLlegadaParadasEditar")
          .val()
          .trim();
        const combustible = $("#combustibleParadasEditar").val().trim();
        const observaciones = $("#observacionesParadasEditar").val().trim();
        const vehiculo = $("#vehiculoParadasEditar").val().trim();

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
          const response = await fetch(`${urlBack}api/paradas/${id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
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
          location.reload();
        } catch (error) {
          alert("Error al editar la parada");
          console.log(error);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

async function eliminarParada(id) {
  try {
    if (confirm("¿Está seguro que desea eliminar la parada?")) {
      const response = await fetch(`${urlBack}api/paradas/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Acceso no autorizado");
      }
      //location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}
