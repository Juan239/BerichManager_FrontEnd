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
      const userArea = data.userArea;

      if (userArea == 3) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No tienes permisos para acceder a esta página",
          showCancelButton: false, // Add a cancel button
          confirmButtonText: "OK", // Change the confirm button text
        }).then((result) => {
            window.location.href = "http://localhost/DAEM/berichmanager/index.html";
            return;
        });
      }

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      //Llamar a la funcion cargarOrdenesTrabajo para completar el datatable cuando cargue la pagina
      cargarBitacoras();
    })
    .catch((error) => {
      console.error("Error:", error.message);
      window.location.href = "http://localhost/DAEM/login.html";
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
    pageLength: 8, // Establecer el número de registros por página en 10
    lengthChange: true, // Deshabilitar la opción de cambiar la cantidad de registros por página
    //dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
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
      
      let botonEliminar = `<a href="#" onClick="eliminarBitacora(${bitacora.bi_id})" title="Eliminar viaje" class="btn btn-danger btn-circle"><i class="fas fa-trash"></i></a>`;
      let botonParadas = `<a href="#" onClick="agregarParadas(${bitacora.bi_id})" title="Agregar parada" class="btn btn-primary btn-circle mr-2"><i class="fas fa-plus"></i></a>`;
      let botonEditar = ""
      let botonCompletar = "";

      if (bitacora.bi_estado === "Completado") {

        botonEditar = `<a href="#" onClick="editarBitacora(${bitacora.bi_id})" title="Editar viaje" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>`;
        botonCompletar =
          '<a href="#" title="Viaje completado" class="btn btn-success btn-circle mr-2 btn-secondary" disabled><i class="fas fa-check"></i></a>';
      } else {
        botonEditar = `<a href="#" id="mensajeEditar" title="Editar viaje" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>`;
        botonCompletar =
          '<a href="#" onClick="completarViaje(' +
          bitacora.bi_id +
          ')" title="Completar viaje" class="btn btn-success btn-circle mr-2"><i class="fas fa-clock"></i></a>';
      }


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
      $("#conductorParadas").empty();
      data.forEach(function (conductor) {
        $("#conductorParadas").append(
          `<option value="${conductor.usr_id}">${conductor.usr_nombre}</option>`
        );
      });
      $("#conductorParadasEditar").empty();
      data.forEach(function (conductor) {
        $("#conductorParadasEditar").append(
          `<option value="${conductor.usr_id}">${conductor.usr_nombre}</option>`
        );
      });
      $("#dropdownConductorDescargarBitacora").empty();
      $("#dropdownConductorDescargarBitacora").append(
        `<option value="0">Todos</option>`
      );
      data.forEach(function (conductor) {
        $("#dropdownConductorDescargarBitacora").append(
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
      $("#vehiculoParadas").empty();
      data.forEach(function (vehiculo) {
        $("#vehiculoParadas").append(
          `<option value="${vehiculo.ve_patente}">${
            vehiculo.ve_patente +
            "  -  " +
            vehiculo.ve_marca +
            " " +
            vehiculo.ve_modelo
          }</option>`
        );
      });
      $("#vehiculoParadasEditar").empty();
      data.forEach(function (vehiculo) {
        $("#vehiculoParadasEditar").append(
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
      $("#destinoParadas").empty();
      data.forEach(function (destino) {
        $("#destinoParadas").append(
          `<option value="${destino.de_id}">${destino.de_nombre}</option>`
        );
      });
      $("#destinoParadasEditar").empty();
      data.forEach(function (destino) {
        $("#destinoParadasEditar").append(
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
    document.getElementById("horaSalidaEditar").value =
      bitacora[0].bi_horasalida;
    document.getElementById("kilometrajeSalidaEditar").value =
      bitacora[0].bi_kilometrajesalida;
    document.getElementById("destinoEditar").value = bitacora[0].bi_destino;
    document.getElementById("funcionarioTrasladadoEditar").value =
      bitacora[0].bi_funcionariotrasladado;
    document.getElementById("fechaLlegadaEditar").value =
      fechaLlegadaFormateada;
    document.getElementById("horaLlegadaEditar").value =
      bitacora[0].bi_horallegada;
    document.getElementById("kilometrajeLlegadaEditar").value =
      bitacora[0].bi_kilometrajellegada;
    document.getElementById("combustibleEditar").value =
      bitacora[0].bi_combustible;
    document.getElementById("observacionesEditar").value =
      bitacora[0].bi_observaciones;
    document.getElementById("vehiculo").value = bitacora[0].bi_vehiculo;

    $("#modalEditarBitacora").modal("show");

    $("#btnEditarBitacora")
      .off()
      .click(async function () {
        try {
          const conductor = document.getElementById("conductorEditar").value;
          const fechaSalida =
            document.getElementById("fechaSalidaEditar").value;
          const horaSalida = document.getElementById("horaSalidaEditar").value;
          const kilometrajeSalida = parseInt(
            document.getElementById("kilometrajeSalidaEditar").value
          );
          const destino = document.getElementById("destinoEditar").value;
          const funcionarioTrasladado = document.getElementById(
            "funcionarioTrasladadoEditar"
          ).value;
          const fechaLlegada =
            document.getElementById("fechaLlegadaEditar").value;
          const horaLlegada =
            document.getElementById("horaLlegadaEditar").value;
          const kilometrajeLlegada = parseInt(
            document.getElementById("kilometrajeLlegadaEditar").value
          );
          const combustible = parseInt(
            document.getElementById("combustibleEditar").value
          );
          const observaciones = document.getElementById(
            "observacionesEditar"
          ).value;
          const vehiculo = document.getElementById("vehiculo").value;

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

          const bitacora = {
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
          };

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

//----------------------------------------------------Funcion eliminar bitacora--------------------------------------
async function eliminarBitacora(id) {
  try {
    if (confirm("¿Está seguro que desea eliminar la bitácora?")) {
      const request = await fetch(`${urlBack}api/bitacoras/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (request.ok) {
        console.log("Bitacora eliminada con éxito:");
        location.reload();
      } else {
        throw new Error("Error al eliminar la bitacora");
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Agregar evento de clic al botón de editar
$(document).on("click", "#mensajeEditar", function () {
  alert("Primero debe completar el viaje para poder editarlo.");
});

//----------------------------------------------------Funcion descargar plantilla--------------------------------------
function descargarPlantilla() {
  const link = document.createElement("a");
  link.href = "http://localhost/DAEM/resources/plantillaBitacoras.xlsx";
  link.download = "plantillaBitacoras.xlsx";
  link.target = "_blank";
  link.click();
}

function imprimirPlantilla() {
  window.open("http://localhost/DAEM/resources/plantillaBitacoras.pdf");
}

//--------------------------------------------------Función descargar bitacoras--------------------------------------
function descargarBitacoras() {
  obtenerConductores();

  $("#btnDescargarBitacora").off().click(async function () {
    console.log("Descargando bitacoras...");
    const conductor = document.getElementById("dropdownConductorDescargarBitacora").value;
    const fechaInicio = document.getElementById("fechaInicialDescargarBitacora").value;
    const fechaFinal = document.getElementById("fechaFinalDescargarBitacora").value;

    try {
      const response = await fetch(`${urlBack}api/descargarBitacoras`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conductor: conductor,
          fechaInicio: fechaInicio,
          fechaFinal: fechaFinal,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la descarga de las bitácoras');
      }

      const data = await response.blob();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `bitacoras(${fechaInicio}/${fechaFinal}).xlsx`;
      document.body.appendChild(link); // Necesario para Firefox
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error:", error.message);
      alert("No se encuentran los datos solicitados, intente nuevamente.");
    }
  });
}
