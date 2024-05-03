//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

//Obtener el token almacenado en el local storage
const token = localStorage.getItem("token");

//-------------------------------------------------------------Obtener datos usuario de la sesion----------------------------------------------
//verificar si el token existe
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
      const userRol = data.userRol;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      if (userRol !== "admin") {
        window.location.href = "http://localhost/DAEM/index.html";
        return;
      }

      //Llamar a la funcion cargarCategorias para completar el datatable cuando cargue la pagina
      cargarActivos();
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
} else {
  console.error("No se encontró ningún token almacenado.");
  window.location.href = "http://localhost/DAEM/login.html";
}

//-----------------------------------------------------------Configuracion Datatable--------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableActivos").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 8
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//--------------------------------------------------------------------Modal agregar categoria--------------------------------------------------------
//Abrir el modal
$(document).ready(function () {
  // Cuando se hace clic en el botón mostramos el modal
  $("#btnAgregarActivo").click(function () {
    $("#modalAgregarActivo").modal("show");
  });
});

//-------------------------------------------------------------Funcion cargar activos--------------------------------------------------------------
async function cargarActivos() {
  // Realizar una petición GET al servidor para obtener los activos
  try {
    const response = await fetch(`${urlBack}api/tipoActivos`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar los activos");
    }

    const activos = await response.json();

    $("#tableActivos").DataTable().clear().draw(); //Se limpia la tabla antes de agregar nuevos datos

    for (let activo of activos) {
      let botonEliminar =
        '<a href="#" onClick="eliminarActivo(' +
        activo.ac_id +
        ')" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>';
      let botonEditar =
        '<a href="#" onClick="editarActivo(' +
        activo.ac_id +
        ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';

      $("#tableActivos")
        .DataTable()
        .row.add([activo.ac_id, activo.ac_nombre, botonEditar + botonEliminar])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function eliminarActivo(id) {
  // Realizar una petición DELETE al servidor para eliminar la categoria
  try {
    if (confirm("¿Está seguro de que desea eliminar el activo?")) {
      const response = await fetch(`${urlBack}api/tipoActivos/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la categoria");
      }

      cargarActivos();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function editarActivo(id) {
  // Realizar una petición GET al servidor para obtener los datos de la categoria
  console.log(id);
  try {
    const response = await fetch(`${urlBack}api/tipoActivos/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del activo");
    }

    const activo = await response.json();

    // Mostrar el modal con los datos de la categoria
    $("#modalEditarActivo").modal("show");
    document.getElementById("nombreActivoEditar").value = activo[0].ac_nombre;

    // Agregar un evento al botón de editar
    document
      .getElementById("btnEditarActivo")
      .addEventListener("click", function () {
        // Aquí va el código que se ejecutará cuando se haga clic en el botón de editar
        const nuevoNombre = document.getElementById("nombreActivoEditar").value;
        try {
          // Realizar una petición PUT al servidor para editar la categoria
          fetch(`${urlBack}api/tipoActivos/${id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              nombre: nuevoNombre,
            }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Error al editar la categoria");
              }
              location.reload();
            })
            .catch((error) => {
              console.error("Error:", error.message);
            });
        } catch (error) {
          console.error("Error:", error.message);
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
  }
}