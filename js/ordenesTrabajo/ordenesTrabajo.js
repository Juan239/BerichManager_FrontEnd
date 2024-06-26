//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

//Obtener el token almacenado en el local storage
const token = localStorage.getItem("token");

let userArea = "";

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
      userArea = data.userArea;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      //Llamar a la funcion cargarOrdenesTrabajo para completar el datatable cuando cargue la pagina
      cargarOrdenesTrabajo(userRol, userArea);
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
  $("#tableOrdenesTrabajo").DataTable({
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

//---------------------------------------Función para obtener los datos de los títulos-----------------------------------
function obtenerTitulos() {
  fetch(`${urlBack}api/categorias`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#titulo").empty();
      data.forEach(function (titulo) {
        $("#titulo").append(
          '<option value="' +
            titulo.cat_id +
            '">' +
            titulo.cat_nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//----------------------------------------------------Modal agregar orden de trabajo--------------------------------------
//Abrir el modal
function agregarOrden() {
  // Muestra el modal al cargar la página
  if (userArea != 3) {
    $("#modalAgregarOrden").modal("show");
    obtenerEstablecimientos();
    obtenerTitulos();
    obtenerFechaActual();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No tienes permisos para agregar una orden de trabajo",
    });
  }
}

//----------------------------------------------------Funcion cargar ordenes de trabajo--------------------------------------
async function cargarOrdenesTrabajo(userRol, userArea) {
  try {
    const response = await fetch(`${urlBack}api/ordenTrabajo`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    //Si recibe una respuesta incorrecta, manda un error
    if (!response.ok) {
      throw new Error("Acceso no autorizado");
    }

    //Se guarda la respuesta en una variable
    const ordenes = await response.json();

    $("#tableOrdenesTrabajo").DataTable().clear().draw(); // Se limpia la tabla antes de agregar nuevos datos

    //Se recorre la respuesta obtenida para ver los datos que contiene
    for (let orden of ordenes) {
      //A cada boton eliminar se le asigna la id correspondiente a cada fila
      let botonPdf =
        '<a href="#" onClick="obtenerPDF(' +
        orden.ot_id +
        ')" title="Ver PDF" class="btn btn-success btn-circle mr-2"><i class="fas fa-file-pdf"></i></a>';

      //Se formatea la fecha obtenida de la respuesta para mostrarla de una mejor manera
      var fechaOriginal = orden.fecha;
      var fechaFormateada = new Date(fechaOriginal).toISOString().split("T")[0];

      if (userRol === "admin") {
        // Solo agregar el botón si el usuario es admin
        let botonEliminar =
          '<a href="#" title="Eliminar" onClick="eliminarOrden(' +
          orden.ot_id +
          ')" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>';

        let botonEditar =
          '<a href="#" title="Editar" onClick="editarOrden(' +
          orden.ot_id +
          ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';

        $("#tableOrdenesTrabajo")
          .DataTable()
          .row.add([
            orden.ot_id,
            fechaFormateada,
            orden.titulo,
            orden.nombre,
            orden.establecimiento,
            botonPdf +
              botonEditar +
              botonEliminar +
              '<p style="display:none;">*' +
              orden.ot_id +
              "*</p>",
          ])
          .draw();
      } else if (userRol === "usuario" && userArea != 3) {
        let botonEditar =
          '<a href="#" title="Editar" onClick="editarOrden(' +
          orden.ot_id +
          ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';
        $("#tableOrdenesTrabajo")
          .DataTable()
          .row.add([
            orden.ot_id,
            fechaFormateada,
            orden.titulo,
            orden.nombre,
            orden.establecimiento,
            botonPdf +
              botonEditar +
              '<p style="display:none;">*' +
              orden.ot_id +
              "*</p>",
            ,
          ])
          .draw();
      } else if (userRol === "usuario" && userArea == 3) {
        $("#tableOrdenesTrabajo")
          .DataTable()
          .row.add([
            orden.ot_id,
            fechaFormateada,
            orden.titulo,
            orden.nombre,
            orden.establecimiento,
            botonPdf + '<p style="display:none;">*' + orden.ot_id + "*</p>",
            ,
          ])
          .draw();
      }
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//---------------------------------------------------------Funcion eliminar orden de trabajo---------------------------------------
async function eliminarOrden(id) {
  try {
    if (confirm("¿Desea eliminar esta orden de trabajo?")) {
      const request = await fetch(`${urlBack}api/ordenTrabajo/` + id, {
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
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión en caso de error, el error obtenido es por la invalidez del token o la ausencia de este
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//---------------------------------------------------------Funcion obtener fecha---------------------------------------------
function obtenerFechaActual() {
  var now = new Date();
  var fechaActual = now.toISOString().slice(0, 10);
  document.getElementById("fecha").value = fechaActual;
  document.getElementById("fechaEditar").value = fechaActual;
  //Se obtiene la fecha actual y se le asigna a la fecha del modal
}

//---------------------------------------------------Función abrir pdf---------------------------------------------------
async function obtenerPDF(id) {
  try {
    const respuesta = await fetch(`${urlBack}api/pdf/ordenTrabajo/${id}`, {
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
    let nombreArchivo = "Orden de trabajo.pdf"; // Nombre predeterminado

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
    console.error("Error:", error);
    // Manejo de errores
  }
}

//------------------------------------------------Funcion editar orden de trabajo-------------------------------------------

async function editarOrden(id) {
  try {
    obtenerEstablecimientosEditar();
    obtenerTitulosEditar();
    $("#modalEditarOrden").modal("show");

    fetch(`${urlBack}api/ordenTrabajo/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la orden");
        }

        // Obtener los datos de la orden en formato JSON
        return response.json();
      })
      .then((data) => {
        //Formatear la fecha
        var fecha = new Date(data[0].ot_fecha);
        var fechaFormateada = fecha.toISOString().split("T")[0];

        if (data[0].ot_colaborador === null) {
          $("#nuevoColaboradorEditar").hide();
          $("#btnAgregarColaboradorEditar").show();
          document.getElementById("colaboradorEditar").value = null;
        } else {
          editarColaborador(data[0].ot_colaborador);
        }

        //Asignar los datos al modal
        document.getElementById("fechaEditar").value = fechaFormateada;
        document.getElementById("tituloEditar").value = data[0].ot_titulo;
        document.getElementById("establecimientoEditar").value =
          data[0].ot_establecimiento;
        document.getElementById("descripcionEditar").value =
          data[0].ot_descripcion;
        document.getElementById("observacionesEditar").value =
          data[0].ot_observaciones;
        document.querySelector(
          `#modalEditar .form-check input[value="${data[0].ot_intervencion}"]`
        ).checked = true;
      })
      .catch((error) => {
        console.error("Error al obtener los datos de la orden:", error);
      });

    $("#btnGuardarCambiosEditar")
      .off()
      .click(async function () {
        try {
          // Se obtienen los datos ingresados en el modal
          const nuevaFecha = $("#fechaEditar").val();
          const nuevoTitulo = $("#tituloEditar").val();
          const nuevoEstablecimiento = parseInt(
            document.getElementById("establecimientoEditar").value
          );
          const nuevaIntervencion = obtenerValorSeleccionadoEditar();
          const nuevaDescripcion = $("#descripcionEditar").val().trim();
          const nuevaObservacion = $("#observacionesEditar").val().trim();
          const nuevoColaborador = $("#colaboradorEditar").val();

          if (
            !nuevaFecha ||
            !nuevoTitulo ||
            !nuevoEstablecimiento ||
            !nuevaIntervencion ||
            !nuevaDescripcion ||
            !nuevaObservacion
          ) {
            alert("Por favor complete todos los campos");
            return;
          }

          // Realizar la petición PUT al servidor para actualizar los datos del usuario
          const editarResponse = await fetch(
            `${urlBack}api/ordenTrabajo/${id}`,
            {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                fecha: nuevaFecha,
                titulo: nuevoTitulo,
                descripcion: nuevaDescripcion,
                observaciones: nuevaObservacion,
                establecimiento: nuevoEstablecimiento,
                intervencion: nuevaIntervencion,
                colaborador: nuevoColaborador,
              }),
            }
          );

          // Verificar si la edición fue exitosa
          if (!editarResponse.ok) {
            throw new Error("Error al editar los datos del usuario");
          }

          console.log("Datos de la orden editados exitosamente");
          location.reload();
        } catch (error) {
          console.error("Error al editar los datos de la orden:", error);
        }
      });
  } catch (error) {
    console.log("Error al realizar la solicitud:", error);
  }
}

//----------------------------------------Función para obtener los datos de los establecimientos para editar----------------------------------------
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

//-----------------------------------Función para obtener los datos de los títulos para editar--------------------------------
function obtenerTitulosEditar() {
  fetch(`${urlBack}api/categorias`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#tituloEditar").empty();
      data.forEach(function (titulo) {
        $("#tituloEditar").append(
          '<option value="' +
            titulo.cat_id +
            '">' +
            titulo.cat_nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

//------------------------------------------------------------Obtener valor de intervencion-----------------------------------------------------
function obtenerValorSeleccionadoEditar() {
  // Obtener todos los radiobutton con el name "intervencion"
  const radioButtons = document.getElementsByName("intervencionEditar");

  // Variable para almacenar el valor seleccionado
  let valorSeleccionado = null;

  // Recorrer todos los radio buttons
  radioButtons.forEach(function (radioButton) {
    // Verificar si el radio button está seleccionado
    if (radioButton.checked) {
      // Obtener el valor del radio button seleccionado
      valorSeleccionado = radioButton.value;
    }
  });

  // Retornar el valor seleccionado
  return valorSeleccionado;
}

function agregarColaborador() {
  $("#nuevoColaborador").show();
  $("#btnAgregarColaborador").hide();

  fetch(`${urlBack}api/colaboradores`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#colaborador").empty();
      data.forEach(function (colaborador) {
        $("#colaborador").append(
          '<option value="' +
            colaborador.usr_id +
            '">' +
            colaborador.nombre +
            "</option>"
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function quitarColaborador() {
  $("#nuevoColaborador").hide();
  $("#btnAgregarColaborador").show();

  document.getElementById("colaborador").value = null;
}

function editarColaborador(colaboradorID) {
  $("#nuevoColaboradorEditar").show();
  $("#btnAgregarColaboradorEditar").hide();

  fetch(`${urlBack}api/colaboradores`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $("#colaboradorEditar").empty();
      data.forEach(function (colaborador) {
        $("#colaboradorEditar").append(
          '<option value="' +
            colaborador.usr_id +
            '">' +
            colaborador.nombre +
            "</option>"
        );
      });
      // Asignar el valor al select después de que las opciones han sido agregadas
      if (colaboradorID) {
        document.getElementById("colaboradorEditar").value = colaboradorID;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function quitarColaboradorEditar() {
  $("#nuevoColaboradorEditar").hide();
  $("#btnAgregarColaboradorEditar").show();

  document.getElementById("colaboradorEditar").value = null;
}
