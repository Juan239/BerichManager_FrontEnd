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
      const idUsuario = data.userId;
      const username = data.username;
      const userRol = data.userRol;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      if (
        userRol !== "admin" &&
        window.location === "http://localhost/DAEM/admin/ordenesTrabajo.html"
      ) {
        window.location.href = "http://localhost/DAEM/ordenesTrabajo.html";
      } else if (
        userRol === "admin" &&
        window.location == "http://localhost/DAEM/ordenesTrabajo.html"
      ) {
        console.log("asd");
        window.location.href =
          "http://localhost/DAEM/admin/ordenesTrabajo.html";
      }

      //Llamar a la funcion cargarOrdenesTrabajo para completar el datatable cuando cargue la pagina
      cargarOrdenesTrabajo(userRol);
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
  $("#tableOrdenesTrabajo").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    order: [[0, "desc"]],
    paging: true, // Habilitar paginación
    pageLength: 5, // Establecer el número de registros por página en 10
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
    /* columnDefs: [
      { width: "5%", targets: 0 },
      { width: "10%", targets: 1 },
      { width: "25%", targets: 2 },
      { width: "25%", targets: 3 }, //Definir el ancho de las columnas de la tabla
      { width: "10%", targets: 4 },
      { width: "15%", targets: 5 },
      { width: "10%", targets: 6 },
    ], */
  });
});

//---------------------------------------------------Dropdown establecimiento------------------------------------------------------
//Se realiza esta funcion al abrir el modal de crear orden
$(document).ready(function () {
  $("#modalAgregarOrden").on("show.bs.modal", function () {
    obtenerFechaActual();
    fetch(`${urlBack}api/establecimientos`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
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
    .catch(error => {
      console.error('Error:', error);
    });
  });
});

//-----------------------------------------------Dropdown titulo-------------------------------------------------------------------
$(document).ready(function () {
  $("#modalAgregarOrden").on("show.bs.modal", function () {
    fetch(`${urlBack}api/categorias`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
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
    .catch(error => {
      console.error('Error:', error);
    });
  });
});


//----------------------------------------------------Modal agregar orden de trabajo--------------------------------------
//Abrir el modal
$(document).ready(function () {
  // Cuando se hace clic en el botón muestra el modal
  $("#btnAgregarOrden").click(function () {
    $("#modalAgregarOrden").modal("show");
  });
});

//----------------------------------------------------Funcion cargar ordenes de trabajo--------------------------------------
async function cargarOrdenesTrabajo(userRol) {
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
        '<a href="#" onClick="obtenerPDF('+ orden.ot_id+')" title="Ver PDF" class="btn btn-success btn-circle"><i class="fas fa-file-pdf"></i></a>';

      //Se formatea la fecha obtenida de la respuesta para mostrarla de una mejor manera
      var fechaOriginal = orden.fecha;
      var fechaFormateada = new Date(fechaOriginal).toISOString().split("T")[0];

      if (userRol === "admin") {
        // Solo agregar el botón si el usuario es admin
        botonEliminar =
          '<a href="#" title="Eliminar" onClick="eliminarOrden(' +
          orden.ot_id +
          ')" class="btn btn-danger btn-circle"><i class="fas fa-trash"></i></a>';

        $("#tableOrdenesTrabajo")
          .DataTable()
          .row.add([
            orden.ot_id,
            fechaFormateada,
            orden.titulo,
            orden.nombre,
            orden.establecimiento,
            botonPdf + " " + botonEliminar,
          ])
          .draw();
      } else {
        $("#tableOrdenesTrabajo")
          .DataTable()
          .row.add([
            orden.ot_id,
            fechaFormateada,
            orden.titulo,
            orden.nombre,
            orden.establecimiento,
            botonPdf,
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
  //Se obtiene la fecha actual y se le asigna a la fecha del modal
}

//---------------------------------------------------Función abrir pdf---------------------------------------------------
async function obtenerPDF(id) {
  try {
    const respuesta = await fetch(`${urlBack}api/pdf/${id}`, {
      method: 'GET', // Método GET para obtener el PDF
    });

    if (!respuesta.ok) {
      throw new Error('Error al obtener el PDF');
    }

    // Verifica si existe un encabezado Content-Disposition
    const disposition = respuesta.headers.get('content-disposition');
    console.log(disposition);
    let nombreArchivo = 'Orden de trabajo.pdf'; // Nombre predeterminado

    if (disposition && disposition.indexOf('attachment') !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches != null && matches[1]) {
        nombreArchivo = matches[1].replace(/['"]/g, '');
      }
    }

    // Convierte la respuesta en un blob (objeto binario)
    const blob = await respuesta.blob();

    // Crea un objeto URL para el blob recibido
    const url = URL.createObjectURL(blob);

    console.log('Nombre del archivo:', nombreArchivo); // Log para el nombre del archivo

    // Abre una nueva pestaña en el navegador con el PDF
    window.open(url, '_blank');
  } catch (error) {
    console.error('Error:', error);
    // Manejo de errores
  }
}

