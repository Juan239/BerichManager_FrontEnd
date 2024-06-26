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

      //Llamar a la funcion cargarCategorias para completar el datatable cuando cargue la pagina
      cargarCategorias();
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
  $("#tableCategorias").DataTable({
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
  $("#btnAgregarCategoria").click(function () {
    $("#modalAgregarCategoria").modal("show");
  });
});

//---------------------------------------------------------------------Funcion cargar categorias---------------------------------------------------------
async function cargarCategorias() {
  try {
    const response = await fetch(`${urlBack}api/categorias`, {
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
    const categorias = await response.json();

    $("#tableCategorias").DataTable().clear().draw(); // Se limpia la tabla antes de agregar nuevos datos

    //Se recorre la respuesta obtenida para ver los datos que contiene y agregarlos a la tabla
    for (let categoria of categorias) {
      //A cada boton eliminar se le asigna la id correspondiente a cada fila
      let botonEliminar =
        '<a href="#" onClick="eliminarCategoria(' +
        categoria.cat_id +
        ')" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>';
      let botonEditar =
        '<a href="#" onClick="editarCategoria(' +
        categoria.cat_id +
        ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';

      $("#tableCategorias")
        .DataTable()
        .row.add([categoria.cat_id, categoria.cat_nombre, botonEditar + botonEliminar])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión en caso de error, el error obtenido es por la invalidez del token o la ausencia de este
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//----------------------------------------------------------Funcion eliminar categoria----------------------------------------------------
async function eliminarCategoria(id) {
  try {
    if (confirm("¿Desea eliminar esta categoria?")) {
      const request = await fetch(`${urlBack}api/categorias/` + id, {
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

//--------------------------------------------------------------------Funcion editar categoria--------------------------------------------------------
async function editarCategoria(id) {
  try {
    const response = await fetch(`${urlBack}api/categorias/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar la categoría");
    }

    const categoria = await response.json();

    $("#modalEditarCategoria").modal("show");
    document.getElementById("nombreCategoriaEditar").value = categoria.cat_nombre;

    // Agregar un evento al botón de editar
    $("#btnEditarCategoria").off().click(async function () {
      // Obtener el nuevo nombre de la categoría y eliminar espacios en blanco al principio y al final
      const nuevoNombreCategoria = document.getElementById("nombreCategoriaEditar").value.trim();

      // Verificar que el nuevo nombre de la categoría no esté vacío
      if (!nuevoNombreCategoria) {
        alert("Por favor ingrese un nuevo nombre para la categoría.");
        return;
      }

      try {
        const response = await fetch(`${urlBack}api/categorias/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nuevoNombreCategoria,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al editar la categoría");
        }

        $("#modalEditarCategoria").modal("hide");
        location.reload();
      } catch (error) {
        console.error("Error:", error.message);
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}
