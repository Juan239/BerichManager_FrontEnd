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
      const userRol = data.userRolInformatica;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      if (userRol !== "admin") {
        // Redirigir al usuario al dashboard si no es administrador
        window.location.href = "http://localhost/DAEM/berichmanager/index.html";
      }

      //Llamar a la funcion cargarAreas para completar el datatable cuando cargue la pagina
      cargarAreas();
    })
    .catch((error) => {
      console.error("Error:", error.message);
      window.location.href = "http://localhost/DAEM/login.html";
    });
} else {
  console.error("No se encontró ningún token almacenado.");
  window.location.href = "http://localhost/DAEM/login.html";
}

//-----------------------------------------------------------Configuracion Datatable--------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableAreas").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 8
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-------------------------------------------------------------Modal agregar area--------------------------------------------------------------
$(document).ready(function () {
  $("#btnAgregarArea").click(function () {
    $("#modalAgregarArea").modal("show");
  });
});

//-------------------------------------------------------------Funcion cargar areas--------------------------------------------------------------
async function cargarAreas() {
  try {
    const request = await fetch(`${urlBack}api/areas`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!request.ok) {
      throw new Error("No se pudo obtener la información de las áreas");
    }

    const areas = await request.json();

    $("#tableAreas").DataTable().clear().draw();

    for (let area of areas) {
      let botonEliminar = `<a href="#" class="btn btn-danger btn-circle mr-2" onclick="eliminarArea(${area.ar_id})"><i class="fas fa-trash"></i></a>`;
      let botonEditar = `<a href="#" class="btn btn-warning btn-circle mr-2" onclick="editarArea(${area.ar_id})"><i class="fas fa-pen"></i></a>`;

      $("#tableAreas")
        .DataTable()
        .row.add([area.ar_id, area.ar_nombre, botonEditar + botonEliminar])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
    //Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Funcion eliminar area--------------------------------------------------------------
async function eliminarArea(id) {
  try {
    if (confirm("¿Estás seguro de que deseas eliminar esta área?")) {
      // Código a ejecutar si el usuario da click en Aceptar
      const request = await fetch(`${urlBack}api/areas/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!request.ok) {
        throw new Error("No se pudo eliminar el área");
      }

      location.reload();
    }
  } catch (error) {
    console.error("Error:", error.message);
    //Redirigir al usuario a la página de inicio de sesión u otra página apropiada
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Funcion editar area--------------------------------------------------------------
async function editarArea(id) {
  try {
    const request = await fetch(`${urlBack}api/areas/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!request.ok) {
      throw new Error("No se pudo cargar la información del área");
    }

    const area = await request.json();

    $("#modalEditarArea").modal("show");
    document.getElementById("nombreAreaEditar").value = area.ar_nombre;

    // Agregar un evento al botón de editar
    $("#btnEditarArea").off().click(async function () {
      // Obtener el nuevo nombre del área y eliminar espacios en blanco al principio y al final
      const nuevoNombreArea = document.getElementById("nombreAreaEditar").value.trim();

      // Verificar que el nuevo nombre del área no esté vacío
      if (!nuevoNombreArea) {
        alert("Por favor ingrese un nuevo nombre para el área.");
        return;
      }

      try {
        const request = await fetch(`${urlBack}api/areas/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nuevoNombreArea,
          }),
        });

        if (!request.ok) {
          throw new Error("No se pudo editar el área");
        }

        location.reload();
      } catch (error) {
        console.error("Error:", error.message);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

