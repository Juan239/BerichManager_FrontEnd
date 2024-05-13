var urlBack = "http://localhost:3000/";
const token = localStorage.getItem("token");

//-------------------------------------------------------------------Obtener datos usuario de la sesion----------------------------------------------------------------------
// Verificar si el token existe
if (token) {
  // Realizar una petición GET al servidor para obtener los datos del usuario
  fetch(`${urlBack}api/credenciales`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      // Verificar si la respuesta es exitosa (código de estado 200)
      if (response.ok) {
        // Obtener los datos de la respuesta en formato JSON
        return response.json();
      } else {
        throw new Error("Acceso no autorizado");
      }
    })
    .then((data) => {
      // Guardar los datos de la respuesta en variables
      const username = data.username;
      const userRol = data.userRolInformatica;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      //Llamar a la funcion cargarOrdenesTrabajo para completar el datatable cuando cargue la pagina
      cargarBitacoras();
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
} else {
  console.error("No se encontró ningún token almacenado.");
  window.location.href = "http://localhost/DAEM/login.html";
}

//--------------------------------------------------------------------Configuracion Datatable------------------------------------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tablaBitacoras").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    order: [[0, "desc"]],
    paging: true, // Habilitar paginación
    pageLength: 5, // Establecer el número de registros por página en 10
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//----------------------------------------------------Modal agregar viaje--------------------------------------
//Abrir el modal
$(document).ready(function () {
  // Cuando se hace clic en el botón muestra el modal
  $("#btnAgregarBitacora").click(function () {
    obtenerConductores();
    obtenerVehiculo();
    obtenerDestino();
    $("#modalAgregarBitacora").modal("show");
  });
});

//----------------------------------------------------Funcion cargar bitacoras--------------------------------------
async function cargarBitacoras() {
  try {
    const response = await fetch(`${urlBack}api/bitacoras`, {
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
    const bitacoras = await response.json();

    $("#tablaBitacoras").DataTable().clear().draw();

    for (let bitacora of bitacoras) {
      //Se formatea la fecha obtenida de la respuesta para mostrarla de una mejor manera
      var fechaOriginal = bitacora.bi_fechasalida;
      var fechaFormateada = new Date(fechaOriginal).toISOString().split("T")[0];

      let botonCompletar = "";

      if (bitacora.bi_estado === "Completado") {
        botonCompletar =
          '<a href="#" title="Viaje completado" class="btn btn-success btn-circle mr-2 btn-secondary" disabled><i class="fas fa-check"></i></a>';
      } else {
        botonCompletar =
          '<a href="#" onClick="completarViaje(' +
          bitacora.bi_id +
          ')" title="Completar viaje" class="btn btn-success btn-circle mr-2"><i class="fas fa-clock"></i></a>';
      }

      let botonEliminar = `<a href="#" onClick="eliminarBitacora(${bitacora.bi_id})" title="Eliminar viaje" class="btn btn-danger btn-circle"><i class="fas fa-trash"></i></a>`;

      let botonEditar = `<a href="#" onClick="editarBitacora(${bitacora.bi_id})" title="Editar viaje" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>`;

      let botonParadas = `<a href="#" onClick="agregarParada(${bitacora.bi_id})" title="Agregar parada" class="btn btn-primary btn-circle mr-2"><i class="fas fa-plus"></i></a>`;

      $("#tablaBitacoras")
        .DataTable()
        .row.add([
          bitacora.bi_id,
          bitacora.conductor,
          fechaFormateada,
          bitacora.destino,
          bitacora.bi_vehiculo,
          botonCompletar + botonParadas + botonEditar + botonEliminar,
        ])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

function obtenerConductores() {
  fetch(`${urlBack}api/conductores`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $("#conductor").empty();
      data.forEach(function (conductor) {
        $("#conductor").append(
          `<option value="${conductor.usr_id}">${conductor.usr_nombre}</option>`
        );
      });
      $("#conductorEditar").empty();
      data.forEach(function (conductor) {
        $("#conductorEditar").append(
          `<option value="${conductor.usr_id}">${conductor.usr_nombre}</option>`
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

function obtenerVehiculo() {
  fetch(`${urlBack}api/vehiculos`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $("#vehiculo").empty();
      data.forEach(function (vehiculo) {
        $("#vehiculo").append(
          `<option value="${vehiculo.ve_patente}">${
            vehiculo.ve_patente +
            "  -  " +
            vehiculo.ve_marca +
            " " +
            vehiculo.ve_modelo
          }</option>`
        );
      });
      $("#vehiculoEditar").empty();
      data.forEach(function (vehiculo) {
        $("#vehiculoEditar").append(
          `<option value="${vehiculo.ve_patente}">${
            vehiculo.ve_patente +
            "  -  " +
            vehiculo.ve_marca +
            " " +
            vehiculo.ve_modelo
          }</option>`
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

function obtenerDestino() {
  fetch(`${urlBack}api/destinos`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      $("#destino").empty();
      data.forEach(function (destino) {
        $("#destino").append(
          `<option value="${destino.de_id}">${destino.de_nombre}</option>`
        );
      });
      $("#destinoEditar").empty();
      data.forEach(function (destino) {
        $("#destinoEditar").append(
          `<option value="${destino.de_id}">${destino.de_nombre}</option>`
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

//----------------------------------------------------Funcion completar viaje--------------------------------------
async function completarViaje(id) {
  $("#modalCompletarBitacora").modal("show");

  $("#btnCompletarBitacora")
    .off()
    .click(async function () {
      try {
        const fechaLlegada = document.getElementById("fechaLlegada").value;
        const horaLlegada = document.getElementById("horaLlegada").value;
        const kilometrajeLlegada = parseInt(
          document.getElementById("kilometrajeLlegada").value
        );
        const combustible = parseInt(
          document.getElementById("combustible").value
        );
        const observaciones = document
          .getElementById("observaciones")
          .value.trim();

        if (
          !fechaLlegada ||
          !horaLlegada ||
          !kilometrajeLlegada ||
          !combustible
        ) {
          alert("Por favor, complete todos los campos.");
          return;
        }

        const viaje = {
          fechaLlegada,
          horaLlegada,
          kilometrajeLlegada,
          combustible,
          observaciones,
        };

        const request = await fetch(`${urlBack}api/completarBitacoras/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(viaje),
        });

        if (request.ok) {
          console.log("Viaje completado con éxito:");
          $("#modalCompletarViaje").modal("hide");
          location.reload();
        } else {
          throw new Error("Error al completar el viaje");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    });
}

//----------------------------------------------------Funcion editar bitacora--------------------------------------
//Modificar los datos, esta funcion NO ESTA TERMINADA
async function editarBitacora(id) {
  obtenerVehiculo();
  obtenerConductores();
  obtenerDestino();
  try {
    const response = await fetch(`${urlBack}api/bitacoras/${id}`, {
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
    const bitacora = await response.json();
    var fechaSalida = new Date(bitacora[0].bi_fechasalida);
    var fechaLlegada = new Date(bitacora[0].bi_fechallegada);
    var fechaSalidaFormateada = fechaSalida.toISOString().split("T")[0];
    var fechaLlegadaFormateada = fechaLlegada.toISOString().split("T")[0];

    document.getElementById("conductorEditar").value = bitacora[0].bi_conductor;
    document.getElementById("fechaSalidaEditar").value = fechaSalidaFormateada;
    document.getElementById("horaSalidaEditar").value = bitacora[0].bi_horasalida;
    document.getElementById("kilometrajeSalidaEditar").value = bitacora[0].bi_kilometrajesalida;
    document.getElementById("destinoEditar").value = bitacora[0].bi_destino;
    document.getElementById("funcionarioTrasladadoEditar").value = bitacora[0].bi_funcionariotrasladado;
    document.getElementById("fechaLlegadaEditar").value = fechaLlegadaFormateada
    document.getElementById("horaLlegadaEditar").value = bitacora[0].bi_horallegada;
    document.getElementById("kilometrajeLlegadaEditar").value = bitacora[0].bi_kilometrajellegada;
    document.getElementById("combustibleEditar").value = bitacora[0].bi_combustible;
    document.getElementById("observacionesEditar").value = bitacora[0].bi_observaciones;
    document.getElementById("vehiculo").value = bitacora[0].bi_vehiculo;

    $("#modalEditarBitacora").modal("show");

    $("#btnEditarBitacora")
      .off()
      .click(async function () {
        try {
          const conductor = document.getElementById("conductorEditar").value;
          const fechaSalida = document.getElementById("fechaSalidaEditar").value;
          const horaSalida = document.getElementById("horaSalidaEditar").value;
          const kilometrajeSalida = parseInt(document.getElementById("kilometrajeSalidaEditar").value);
          const destino = document.getElementById("destinoEditar").value;
          const funcionarioTrasladado = document.getElementById("funcionarioTrasladadoEditar").value;
          const fechaLlegada = document.getElementById("fechaLlegadaEditar").value;
          const horaLlegada = document.getElementById("horaLlegadaEditar").value;
          const kilometrajeLlegada = parseInt(document.getElementById("kilometrajeLlegadaEditar").value);
          const combustible = parseInt(document.getElementById("combustibleEditar").value);
          const observaciones = document.getElementById("observacionesEditar").value;
          const vehiculo = document.getElementById("vehiculo").value;
          

          if(
            !conductor ||
            !fechaSalida ||
            !horaSalida ||
            !kilometrajeSalida ||
            !destino ||
            !fechaLlegada ||
            !horaLlegada ||
            !kilometrajeLlegada ||
            !vehiculo
          ){
            alert("Por favor, complete todos los campos.");
            return;
          }

          const bitacora = { conductor, fechaSalida, horaSalida, kilometrajeSalida, destino, funcionarioTrasladado, fechaLlegada, horaLlegada, kilometrajeLlegada, combustible, observaciones, vehiculo };

          const request = await fetch(`${urlBack}api/bitacoras/${id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bitacora),
          });

          if (request.ok) {
            console.log("Bitacora actualizada con éxito:");
            $("#modalEditarBitacora").modal("hide");
            location.reload();
          } else {
            throw new Error("Error al actualizar la bitacora");
          }
        } catch (error) {
          console.error("Error:", error.message);
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
  }
}
