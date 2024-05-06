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

      //Llamar a la funcion cargarMarcas para completar el datatable cuando cargue la pagina
      cargarMarcas();
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
  $("#tableMarcas").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 8
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-------------------------------------------------------------Modal agregar marcas--------------------------------------------------
//Abri el modal
$(document).ready(function () {
  $("#btnAgregarMarca").click(function () {
    $("#modalAgregarMarca").modal("show");
  });
});

//-------------------------------------------------------------Funcion cargar marcas--------------------------------------------------
async function cargarMarcas() {
  try {
    // Realizar una petición GET al servidor para obtener las marcas
    const response = await fetch(`${urlBack}api/marcas`, {
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

    // Verificar si la respuesta es exitosa (código de estado 200)

    // Obtener los datos de la respuesta en formato JSON
    const marcas = await response.json();

    $("#tableMarcas").DataTable().clear().draw();

    for (let marca of marcas) {
      let botonEliminar =
        '<a href="#" onClick="eliminarMarca(' +
        marca.ma_id +
        ')" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>';
      let botonEditar =
        '<a href="#" onClick="editarMarca(' +
        marca.ma_id +
        ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';

      $("#tableMarcas")
        .DataTable()
        .row.add([marca.ma_id, marca.ma_nombre, botonEditar + botonEliminar])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Funcion eliminar marca--------------------------------------------------
async function eliminarMarca(id) {
  try {
    if (confirm("¿Desea eliminar esta marca?")) {
      // Realizar una petición DELETE al servidor para eliminar una marca
      const response = await fetch(`${urlBack}api/marcas/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }
    // Recargar el datatable
    location.reload();
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Funcion editar marca--------------------------------------------------
async function editarMarca(id) {
  try {
    // Realizar una petición GET al servidor para obtener una marca
    const response = await fetch(`${urlBack}api/marcas/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar la marca");
    }

    // Obtener los datos de la respuesta en formato JSON
    const marca = await response.json();

    // Abrir el modal
    $("#modalEditarMarca").modal("show");

    // Completar los campos del modal con los datos de la marca
    document.getElementById("nombreMarcaEditar").value = marca.ma_nombre;

    document.getElementById("btnEditarMarca").onclick = async function () {
      try {
        // Realizar una petición PUT al servidor para editar una marca
        const response = await fetch(`${urlBack}api/marcas/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: document.getElementById("nombreMarcaEditar").value,
          }),
        });

        // Cerrar el modal
        $("#modalEditarMarca").modal("hide");

        // Recargar el datatable
        location.reload();
      } catch (error) {
        console.error("Error:", error.message);
        window.location.href = "http://localhost/DAEM/login.html";
      }
    };
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}
