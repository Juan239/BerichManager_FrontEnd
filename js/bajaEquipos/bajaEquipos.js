//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

//Obtener el token almacenado en el local storage
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
      const userId = data.userId;
      const username = data.username;
      const userRol = data.userRolInformatica;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      cargarBajaEquipos(userRol, userId);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
} else {
  window.location.href = "http://localhost/DAEM/login.html";
  console.log("No se encuentra el token de acceso");
}

//--------------------------------------------------------------------Configuracion Datatable------------------------------------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableBajaEquipos").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    order: [[0, "desc"]],
    paging: true, // Habilitar paginación
    pageLength: 5, // Establecer el número de registros por página en 10
    lengthChange: true, // Deshabilitar la opción de cambiar la cantidad de registros por página
    //dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-----------------------------------------Función para obtener el tipo de activo----------------------------------
function obtenerTipoActivo() {
  fetch(`${urlBack}api/tipoActivos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#tipoActivo").empty();
      data.forEach(function (tipoActivo) {
        $("#tipoActivo").append(
          '<option value="' +
            tipoActivo.ac_id +
            '">' +
            tipoActivo.ac_nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//-----------------------------------------Función para obtener la marca----------------------------------
function obtenerMarcas() {
  fetch(`${urlBack}api/marcas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#marca").empty();
      data.forEach(function (marca) {
        $("#marca").append(
          '<option value="' + marca.ma_id + '">' + marca.ma_nombre + "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//---------------------------------------Función para obtener los datos de los establecimientos------------------------------
function obtenerEstablecimientos() {
  fetch(`${urlBack}api/establecimientos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#establecimiento").empty();
      data.forEach(function (establecimiento) {
        $("#establecimiento").append(
          '<option value="' +
            establecimiento.est_id +
            '">' +
            establecimiento.est_nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//----------------------------------------------------Modal agregar informe--------------------------------------
//Abrir el modal
$(document).ready(function () {
  // Cuando se hace clic en el botón muestra el modal
  $("#btnAgregarBajaActivo").click(function () {
    $("#modalAgregarBajaActivo").modal("show");
    obtenerEstablecimientos();
    obtenerMarcas();
    obtenerTipoActivo();
    obtenerFechaActual();
  });
});

//---------------------------------------------------------Funcion obtener fecha---------------------------------------------
function obtenerFechaActual() {
  var now = new Date();
  var fechaActual = now.toISOString().slice(0, 10);
  document.getElementById("fecha").value = fechaActual;
  document.getElementById("fechaEditar").value = fechaActual;
  //Se obtiene la fecha actual y se le asigna a la fecha del modal
}

//----------------------------------------------------CARGAR INFORMES-----------------------------------------
async function cargarBajaEquipos(userRol, userName) {
  try {
    const response = await fetch(`${urlBack}api/bajaEquipos`, {
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

    const informes = await response.json();

    $("#tableBajaEquipos").DataTable().clear().draw();

    for (let informe of informes) {
      let botonPdf =
        '<a href="#" onClick="obtenerPDF(' +
        informe.be_id +
        ')" title="Ver PDF" class="btn btn-success btn-circle mr-2"><i class="fas fa-file-pdf"></i></a>';

      var fechaOriginal = informe.fecha;
      var fechaFormateada = new Date(fechaOriginal).toISOString().split("T")[0];

      if (userRol === "admin") {
        let botonEliminar =
          '<a href="#" onClick="eliminarInforme(' +
          informe.be_id +
          ')" title="Eliminar" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>';
        let botonEditar =
          '<a href="#" onClick="editarBajaEquipo(' +
          informe.be_id +
          ", '" +
          userName +
          "'" +
          ')" title="Editar" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pencil-alt"></i></a>';

        $("#tableBajaEquipos")
          .DataTable()
          .row.add([
            informe.be_id,
            fechaFormateada,
            informe.tipoActivo,
            informe.ubicacion,
            informe.nombre,
            botonPdf + botonEditar + botonEliminar,
          ])
          .draw();
      } else {
        $("#tableBajaEquipos")
          .DataTable()
          .row.add([
            informe.be_id,
            fechaFormateada,
            informe.tipoActivo,
            informe.ubicacion,
            informe.nombre,
            botonPdf,
          ])
          .draw();
      }
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//----------------------------------------------------Funcion para eliminar informe--------------------------------------
async function eliminarInforme(id) {
  try {
    if (confirm("¿Está seguro que desea eliminar este informe?")) {
      const response = await fetch(`${urlBack}api/bajaEquipos/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      location.reload();
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//----------------------------------------------------Funcion para editar informe--------------------------------------
async function editarBajaEquipo(id, userName) {
  try {
    obtenerEstablecimientosEditar();
    obtenerMarcasEditar();
    obtenerTipoActivoEditar();
    obtenerFechaActual();
    $("#modalEditarBajaActivo").modal("show");

    const response = await fetch(`${urlBack}api/bajaEquipos/${id}`, {
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

    var fecha = new Date(data.be_fecha).toISOString().split("T")[0];

    document.getElementById("fechaEditar").value = fecha;
    document.getElementById("tipoActivoEditar").value = data.be_tipoActivo;
    document.getElementById("marcaEditar").value = data.be_marca;
    document.getElementById("modeloEditar").value = data.be_modelo;
    document.getElementById("establecimientoEditar").value = data.be_ubicacion;
    document.getElementById("relacionSolicitudEditar").value =
      data.be_relacionSolicitud;
    document.getElementById("detalleEditar").value = data.be_detalle;
    document.getElementById("conceptoTecnicoEditar").value =
      data.be_conceptoTecnico;

    $("#btnEditarBajaActivo").off().click(async function () {
      try {
        const nuevaFecha = $("#fechaEditar").val().trim();
        const nuevoTipoActivo = $("#tipoActivoEditar").val().trim();
        const nuevaMarca = $("#marcaEditar").val().trim();
        const nuevoModelo = $("#modeloEditar").val().trim();
        const nuevoEstablecimiento = $("#establecimientoEditar").val().trim();
        const nuevaRelacionSolicitud = $("#relacionSolicitudEditar").val().trim();
        const nuevoDetalle = $("#detalleEditar").val().trim();
        const nuevoConceptoTecnico = $("#conceptoTecnicoEditar").val().trim();
        const nuevoResponsable = userName;

        // Verificar que los campos obligatorios no estén vacíos o sean solo espacios en blanco
        if (!nuevaFecha || !nuevoTipoActivo || !nuevaMarca || !nuevoModelo || !nuevoEstablecimiento || !nuevaRelacionSolicitud || !nuevoDetalle || !nuevoConceptoTecnico) {
          alert("Por favor complete todos los campos obligatorios.");
          return;
        }

        const editarResponse = await fetch(`${urlBack}api/bajaEquipos/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fecha: nuevaFecha,
            tipoActivo: nuevoTipoActivo,
            marca: nuevaMarca,
            modelo: nuevoModelo,
            ubicacion: nuevoEstablecimiento,
            responsable: nuevoResponsable,
            relacionSolicitud: nuevaRelacionSolicitud,
            detalle: nuevoDetalle,
            conceptoTecnico: nuevoConceptoTecnico,
          }),
        });

        if (!editarResponse.ok) {
          throw new Error("Error al editar el informe");
        }
        console.log("Informe editado correctamente");
        location.reload();
      } catch (error) {
        console.error("Error:", error);
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
}


//-----------------------------------------Función para obtener el tipo de activo----------------------------------
function obtenerTipoActivoEditar() {
  fetch(`${urlBack}api/tipoActivos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#tipoActivoEditar").empty();
      data.forEach(function (tipoActivo) {
        $("#tipoActivoEditar").append(
          '<option value="' +
            tipoActivo.ac_id +
            '">' +
            tipoActivo.ac_nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//-----------------------------------------Función para obtener la marca----------------------------------
function obtenerMarcasEditar() {
  fetch(`${urlBack}api/marcas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#marcaEditar").empty();
      data.forEach(function (marca) {
        $("#marcaEditar").append(
          '<option value="' + marca.ma_id + '">' + marca.ma_nombre + "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//---------------------------------------Función para obtener los datos de los establecimientos------------------------------
function obtenerEstablecimientosEditar() {
  fetch(`${urlBack}api/establecimientos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#establecimientoEditar").empty();
      data.forEach(function (establecimiento) {
        $("#establecimientoEditar").append(
          '<option value="' +
            establecimiento.est_id +
            '">' +
            establecimiento.est_nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//---------------------------------------------------Función abrir pdf---------------------------------------------------
async function obtenerPDF(id) {
  try {
    const respuesta = await fetch(`${urlBack}api/pdf/bajaEquipos/${id}`, {
      method: "GET", // Método GET para obtener el PDF
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!respuesta.ok) {
      throw new Error("Error al obtener el PDF");
    }

    // Verifica si existe un encabezado Content-Disposition
    const disposition = respuesta.headers.get("content-disposition");
    console.log(disposition);
    let nombreArchivo = "Baja equipos.pdf"; // Nombre predeterminado

    if (disposition && disposition.indexOf("attachment") !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
        disposition
      );
      if (matches != null && matches[1]) {
        nombreArchivo = matches[1].replace(/['"]/g, "");
      }
    }

    // Convierte la respuesta en un blob (objeto binario)
    const blob = await respuesta.blob();

    // Crea un objeto URL para el blob recibido
    const url = URL.createObjectURL(blob);

    console.log("Nombre del archivo:", nombreArchivo); // Log para el nombre del archivo

    // Abre una nueva pestaña en el navegador con el PDF
    window.open(url, "_blank");
  } catch (error) {
    // Manejo de errores
    console.error("Error:", error);
  }
}
