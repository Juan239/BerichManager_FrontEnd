var urlBack = "http://localhost:3000/";

//Obtener el token almacenado en el local storage
const token = localStorage.getItem("token");

let userArea = "";

//--------------------------------------Obtener datos del usuario--------------------------------------
//Verificar si el token existe
if (token) {
  //Realizar una peticion al servidor para obtener los datos del usuario
  fetch(`${urlBack}api/credenciales`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      //Verificar si la peticion fue exitosa
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Acceso no autorizado");
      }
    })
    .then((data) => {
      //Guardar los datos de la respuesta en variables
      const username = data.username;
      const userRol = data.userRolInformatica;
      userArea = data.userArea;

      if (username !== null) {
        //Mostrar el nombre del usuario en la barra de navegacion
        document.getElementById("nombreDeUsuario").innerHTML = username;
      }

      cargarSolicitudes(userRol, userArea);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      //window.location.href = "http://localhost/DAEM/login.html";
    });
} else {
  console.log("No hay un token almacenado");
  //window.location.href = "http://localhost/DAEM/login.html";
}

//-------------------------------------Configuracion datatable-------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableSolicitudesCompra").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    order: [[0, "desc"]],
    bDestroy: true,
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 10
    lengthChange: true, // Deshabilitar la opción de cambiar la cantidad de registros por página
    //dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-------------------------------------Funcion para obtener los datos de los establecimientos-------------------------------------

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
      $("#establecimiento").append(
        '<option value="" disabled selected hidden>Seleccione un establecimiento</option>'
      );
      $("#establecimientoEditar").empty();
      $("#establecimientoEditar").append(
        '<option value="" disabled selected hidden>Seleccione un establecimiento</option>'
      );

      data.forEach(function (establecimiento) {
        $("#establecimiento").append(
          '<option value="' +
            establecimiento.est_id +
            '">' +
            establecimiento.est_nombre +
            "</option>"
        );
      });

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
//-------------------------------------Funcion para obtener las solicitudes-------------------------------------
function cargarSolicitudes(userRol, userArea) {
  fetch(`${urlBack}api/solicitudes/compra`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Acceso no autorizado");
      }
    })
    .then((data) => {
      $("#tableSolicitudesCompra").DataTable().clear().draw();

      data.forEach((solicitud) => {
        let acciones = "";
        let botonVerPDF = `<button type="button" title="Ver PDF" class="btn btn-success btn-circle mr-2" onclick="verPDF(${solicitud.soc_id})"><i class="fas fa-file-pdf"></i></button>`;

        if (userArea == 3) {
          acciones = botonVerPDF;
        } else {
          let botonEditar = `<button type="button" title="Ver solicitud" class="btn btn-primary btn-circle mr-2" onclick="editarSolicitud(${solicitud.soc_id})"><i class="fas fa-eye"></i></button>`;
          acciones += botonVerPDF + botonEditar;

          if (userRol === "admin") {
            let botonEliminar = `<button type="button" title="Eliminar solicitud" class="btn btn-danger btn-circle mr-2" onclick="eliminarSolicitud(${solicitud.soc_id})"><i class="fas fa-trash"></i></button>`;
            acciones += botonEliminar;
          }
        }

        const fechaFormateada = new Date(solicitud.soc_fecha)
          .toISOString()
          .split("T")[0];

        $("#tableSolicitudesCompra")
          .DataTable()
          .row.add([
            solicitud.soc_id,
            fechaFormateada,
            solicitud.establecimiento,
            solicitud.responsable,
            acciones +'<p style="display:none;">*' +
              solicitud.soc_id +
              "*</p>",
          ])
          .draw();
      });
    });
}

//-------------------------------------Funcion para editar una solicitud-------------------------------------
function editarSolicitud(id) {
  $("#modalEditarSolicitud").modal("show");
  obtenerEstablecimientos();

  fetch(`${urlBack}api/solicitudes/compra/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let fechaFormateada = new Date(data[0].soc_fecha)
        .toISOString()
        .split("T")[0];

      document.getElementById("fechaEditar").value = fechaFormateada;
      document.getElementById("establecimientoEditar").value =
        data[0].soc_establecimiento;
      document.getElementById("mensajeSolicitudEditar").value =
        data[0].soc_mensaje;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    const checkboxEditar = document.getElementById("checkboxEditar");
    
    checkboxEditar.addEventListener("change", function() {
      const fechaEditar = document.getElementById("fechaEditar");
      const establecimientoEditar = document.getElementById("establecimientoEditar");
      const mensajeSolicitudEditar = document.getElementById("mensajeSolicitudEditar");
      const btnCancelarSolicitudCompraEditar = document.getElementById("btnCancelarSolicitudCompraEditar");
      const btnGuardarSolicitudCompraEditar = document.getElementById("btnGuardarSolicitudCompraEditar");
      
      if (!checkboxEditar.checked) {
      fechaEditar.disabled = true;
      establecimientoEditar.disabled = true;
      mensajeSolicitudEditar.disabled = true;
      btnCancelarSolicitudCompraEditar.style.display = "none";
      btnGuardarSolicitudCompraEditar.style.display = "none";
      }
      else {
      fechaEditar.disabled = false;
      establecimientoEditar.disabled = false;
      mensajeSolicitudEditar.disabled = false;
      btnCancelarSolicitudCompraEditar.style.display = "block";
      btnGuardarSolicitudCompraEditar.style.display = "block";
      }
    });

    // Deshabilitar campos de edición al abrir el modal
    document.getElementById("checkboxEditar").checked = false;
    document.getElementById("fechaEditar").disabled = true;
    document.getElementById("establecimientoEditar").disabled = true;
    document.getElementById("mensajeSolicitudEditar").disabled = true;
    document.getElementById("btnCancelarSolicitudCompraEditar").style.display = "none";
    document.getElementById("btnGuardarSolicitudCompraEditar").style.display = "none";


  $("#btnGuardarSolicitudCompraEditar")
    .off()
    .click(function () {
      try {
        const nuevaFecha = document.getElementById("fechaEditar").value;
        const nuevoEstablecimiento = document.getElementById(
          "establecimientoEditar"
        ).value;
        const nuevoMensaje = document
          .getElementById("mensajeSolicitudEditar")
          .value.trim();

        if (!nuevaFecha || !nuevoEstablecimiento || !nuevoMensaje) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Rellene todos los campos para continuar",
          });
          return;
        }

        fetch(`${urlBack}api/solicitudes/compra/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fecha: nuevaFecha,
            establecimiento: nuevoEstablecimiento,
            solicitud: nuevoMensaje,
          }),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "Solicitud actualizada",
                text: "La solicitud de compra ha sido actualizada con éxito",
                showConfirmButton: false,
                timer: 1000,
              }).then(() => {
                $("#modalEditarSolicitud").modal("hide");
                location.reload();
              });
            } else {
              throw new Error("Error al actualizar la solicitud de compra");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        console.log("Error:", error);
      }
    });
}

function eliminarSolicitud(id){
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${urlBack}api/solicitudes/compra/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            Swal.fire({
              icon: "success",
              title: "Solicitud eliminada",
              text: "La solicitud de compra ha sido eliminada con éxito",
              showConfirmButton: false,
              timer: 1000,
            }).then(() => {
              location.reload();
            });
          } else {
            throw new Error("Error al eliminar la solicitud de compra");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });

}

function verPDF(id) {
  console.log("Generando PDF..." + id);
  try {
    fetch(`${urlBack}api/pdf/solicitudCompra/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (response) => {
      // Verifica si la respuesta es correcta
      if (!response.ok) {
        throw new Error('Error al obtener el PDF');
      }

      // Verifica si existe un encabezado Content-Disposition
      const disposition = response.headers.get("content-disposition");
      console.log(disposition);
      let nombreArchivo = "Solicitud de compra.pdf"; // Nombre predeterminado

      if (disposition && disposition.indexOf("attachment") !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches != null && matches[1]) {
          nombreArchivo = matches[1].replace(/['"]/g, "");
        }
      }

      // Convierte la respuesta en un blob (objeto binario)
      const blob = await response.blob();
      return ({ blob, nombreArchivo });
    })
    .then(({ blob, nombreArchivo }) => {
      // Crea un objeto URL para el blob recibido
      const url = URL.createObjectURL(blob);

      console.log("Nombre del archivo:", nombreArchivo); // Log para el nombre del archivo

      // Abre una nueva pestaña en el navegador con el PDF
      window.open(url, "_blank");

      // Limpia el objeto URL cuando ya no se necesita
      URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  } catch (error) {
    console.log("Error:", error);
  }
}


//-------------------------------------Modal agregar orden de trabajo---------------------------------------
function agregarSolicitud() {
  if (userArea != 3) {
    $("#modalAgregarSolicitud").modal("show");
    obtenerFechaActual();
    obtenerEstablecimientos();
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "No tienes permisos para agregar una solicitud",
    });
  }
}

//-------------------------------------Funcion obtener fecha actual-------------------------------------
function obtenerFechaActual() {
  var now = new Date();
  var fechaActual = now.toISOString().slice(0, 10);
  document.getElementById("fecha").value = fechaActual;
  //Se obtiene la fecha actual y se le asigna a la fecha del modal
}


