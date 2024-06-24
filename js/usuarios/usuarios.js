//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

//Obtener el token almacenado en el local storage
const token = localStorage.getItem("token");


document.getElementById("areaEditar").addEventListener("change", function() {
  if (this.value == 3) {
    document.getElementById("rolInformaticaCheckboxEditar").checked = false;
    document.getElementById("rolBitacorasCheckboxEditar").checked = false;

    document.getElementById("rolInformaticaCheckboxEditar").disabled = true;
    document.getElementById("rolBitacorasCheckboxEditar").disabled = true;
  } else {
    document.getElementById("rolInformaticaCheckboxEditar").disabled = false;
    document.getElementById("rolBitacorasCheckboxEditar").disabled = false;
  }
});

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

      if (userRol !== "admin") {
        // Redirigir al usuario al dashboard si no es administrador
        window.location.href = "http://localhost/DAEM/berichmanager/index.html";
      }

      //Llamar a la funcion cargarUsuarios para completar el datatable cuando cargue la página
      cargarUsuarios();
    })
    .catch((error) => {
      window.location.href = "http://localhost/DAEM/login.html";
      console.error("Error:", error.message);
    });
} else {
  window.location.href = "http://localhost/DAEM/login.html";
  alert("Su sesión ha expirado");
}

//----------------------------------------------------------Configuracion Datatable-------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableUsuarios").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 10
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-----------------------------------------------Modal agregar usuarios----------------------------------------------------------
//Abrir el modal
$(document).ready(function () {
  // Cuando se hace clic en el botón mostramos el modal agregar usuarios
  $("#btnAgregarUsuario").click(function () {
    obtenerArea();
    $("#modalAgregarUsuario").modal("show");
  });

  // Codigo para ver la contraseña
  $(".toggle-password").click(function () {
    $(this).toggleClass("active");
    let input = $($(this).closest(".input-group").find("input"));
    if (input.attr("type") === "password") {
      input.attr("type", "text");
      $(this).find("i").removeClass("fa-eye-slash").addClass("fa-eye");
    } else {
      input.attr("type", "password");
      $(this).find("i").removeClass("fa-eye").addClass("fa-eye-slash");
    }
  });
});

//-------------------------------------------------Funcion obtener area-------------------------------------------------------
function obtenerArea() {
  fetch(`${urlBack}api/areas`, {
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
      $("#area").empty();
      $("#areaEditar").empty();
      data.forEach(function (area) {
        $("#area").append(
          `<option value="${area.ar_id}">${area.ar_nombre}</option>`
        );
      });
      data.forEach(function (area) {
        $("#areaEditar").append(
          `<option value="${area.ar_id}">${area.ar_nombre}</option>`
        );
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

//------------------------------------------------Función cargar usuarios--------------------------------------------------
//Con esta funcion los registros se agregan directamente al datatable, por lo que ya funcionaria el buscar y la paginacion. *NO AGREGAR COMO HTML, NO FUNCIONA*
async function cargarUsuarios() {
  try {
    const response = await fetch(`${urlBack}api/usuarios`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado de autorización
      },
    });

    //Si recibe una respuesta incorrecta, manda un error
    if (!response.ok) {
      throw new Error("Acceso no autorizado");
    }

    //Se guarda la respuesta en una variable
    const usuarios = await response.json();

    $("#tableUsuarios").DataTable().clear().draw(); // Limpiar la tabla antes de agregar nuevos datos

    //Se recorre la respuesta obtenida para ver los datos que contiene y agregarlos a la tabla
    for (let usuario of usuarios) {
      let botonEliminar =
        '<a href="#" onClick="eliminarUsuario(' +
        usuario.usr_id +
        ')" class="btn btn-danger btn-circle"><i class="fas fa-trash"></i></a>';

      let botonEditar =
        '<a href="#" onClick="editarUsuario(' +
        usuario.usr_id +
        ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';

      $("#tableUsuarios")
        .DataTable()
        .row.add([
          usuario.usr_id,
          usuario.usr_rut,
          usuario.usr_nombre + " " +usuario.usr_apellido,
          usuario.usr_username,
          usuario.usr_rol_informatica,
          usuario.usr_rol_bitacoras,
          botonEditar + botonEliminar,
        ])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión u otra página apropiada, el error obtenido es por la invalidez del token o la ausencia de este
    //window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-----------------------------------------------Funcion eliminar usuario-------------------------------------------------------
async function eliminarUsuario(id) {
  try {
    if (confirm("¿Desea eliminar este usuario?")) {
      const request = await fetch(`${urlBack}api/usuarios/` + id, {
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

//------------------------------------------Funcion editar usuario-----------------------------------
async function editarUsuario(id) {
  try {
    // Abrir el modal editar usuario
    obtenerArea();
    $("#modalEditarUsuario").modal("show");

    // Realizar la solicitud GET al servidor para obtener los datos del usuario seleccionado
    const response = await fetch(`${urlBack}api/usuarios/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error("Error al obtener los datos del usuario");
    }

    // Obtener los datos del usuario en formato JSON
    const data = await response.json();

    const admin = "admin";
    const normal = "usuario";
    let rolInformatica = data.rol_informatica;
    let rolBitacoras = data.rol_bitacoras;
    let area = data.area;

    if (rolInformatica === admin) {
      rolInformatica = true;
    } else if (rolInformatica === normal) {
      rolInformatica = false;
    }

    if (rolBitacoras === admin) {
      rolBitacoras = true;
    } else if (rolBitacoras === normal) {
      rolBitacoras = false;
    }

    if(area == 3){
      document.getElementById("rolInformaticaCheckboxEditar").disabled = true;
    document.getElementById("rolBitacorasCheckboxEditar").disabled = true;
    }

    // Mostrar los datos del usuario en el modal de edición
    document.getElementById("nombreEditar").value = data.nombre;
    document.getElementById("apellidoEditar").value = data.apellido;
    document.getElementById("rutEditar").value = data.rut;
    document.getElementById("nombreUsuarioEditar").value = data.username;
    document.getElementById("rolInformaticaCheckboxEditar").checked =
      rolInformatica;
    document.getElementById("rolBitacorasCheckboxEditar").checked =
      rolBitacoras;
    document.getElementById("areaEditar").value = data.area;

    // Listener para el botón de guardar cambios del modal
    $("#btnEditarUsuario")
      .off()
      .click(async function () {
        // Se obtienen los datos ingresados en el modal
        const nuevoNombre = $("#nombreEditar").val().trim();
        const nuevoApellido = $("#apellidoEditar").val().trim();
        const nuevoRut = $("#rutEditar").val().trim();
        const nuevoNombreUsuario = $("#nombreUsuarioEditar").val().trim();
        const nuevaPassword = $("#contrasenaEditar").val().trim();
        const nuevoRolInformatica = document.getElementById(
          "rolInformaticaCheckboxEditar"
        ).checked;
        const nuevoRolBitacoras = document.getElementById(
          "rolBitacorasCheckboxEditar"
        ).checked;
        const nuevoArea = $("#areaEditar").val();

        // Verificar que los campos obligatorios no estén vacíos
        if (!nuevoNombre || !nuevoApellido || !nuevoNombreUsuario) {
          alert("Por favor complete todos los campos obligatorios.");
          return;
        }

        try {
          // Realizar la petición PUT al servidor para actualizar los datos del usuario
          const editarResponse = await fetch(`${urlBack}api/usuarios/${id}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              nombre: nuevoNombre,
              apellido: nuevoApellido,
              rut: nuevoRut,
              username: nuevoNombreUsuario,
              password: nuevaPassword,
              rolInformatica: nuevoRolInformatica,
              rolBitacoras: nuevoRolBitacoras,
              area : nuevoArea
            }),
          });

          // Verificar si la edición fue exitosa
          if (!editarResponse.ok) {
            throw new Error("Error al editar los datos del usuario");
          }

          console.log("Datos del usuario editados exitosamente");
          location.reload();
        } catch (error) {
          console.error("Error al editar los datos del usuario:", error);
        }
      });
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
  }
}
