var urlBack = "http://localhost:3000/";

const token = localStorage.getItem("token");

//-------------------------------------------------------------------Obtener datos usuario de la sesion----------------------------------------------------------------------
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
      const userRol = data.userRolBitacoras;
      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      if (userRol !== "admin") {
        // Redirigir al usuario al dashboard si no es administrador
        window.location.href = "http://localhost/DAEM/berichmanager/index.html";
      }

      cargarConductores();
    })
    .catch((error) => {
      window.location.href = "http://localhost/DAEM/login.html";
      console.error("Error:", error.message);
    });
} else {
  window.location.href = "http://localhost/DAEM/login.html";
}

//----------------------------------------------------------Configuracion Datatable-------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableConductores").DataTable({
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
  $("#btnAgregarConductor").click(function () {
    $("#modalAgregarConductor").modal("show");
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

//---------------------------------------------------------------Cargar conductores-----------------------------------------------------
async function cargarConductores() {
  try {
    const response = await fetch(`${urlBack}api/conductores`, {
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
    const conductores = await response.json();

    $("#tableConductores").DataTable().clear().draw();

    for (let conductor of conductores) {
      let botonEliminar =
        '<a href="#" onClick="eliminarConductor(' +
        conductor.usr_id +
        ')" class="btn btn-danger btn-circle"><i class="fas fa-trash"></i></a>';

      let botonEditar =
        '<a href="#" onClick="editarConductor(' +
        conductor.usr_id +
        ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';

      $("#tableConductores")
        .DataTable()
        .row.add([
          conductor.usr_id,
          conductor.usr_rut,
          conductor.usr_nombre +" "+ conductor.usr_apellido,
          conductor.usr_username,
          botonEditar + botonEliminar,
        ])
        .draw();
    }
  } catch (error) {
    window.location.href = "http://localhost/DAEM/login.html";
    console.error("Error:", error.message);
  }
}

//---------------------------------------------------------------Eliminar conductores-----------------------------------------------------
async function eliminarConductor(id) {
  try {
    if (confirm("¿Está seguro que desea eliminar este conductor?")) {
      const response = await fetch(`${urlBack}api/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Acceso no autorizado");
      }
      location.reload();
    }
  } catch (error) {
    alert("Error:", error.message);
  }
}

//---------------------------------------------------------------Editar conductores-----------------------------------------------------
async function editarConductor(id) {
    try {
      $("#modalEditarConductor").modal("show");

      const response = await fetch(`${urlBack}api/usuarios/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener los datos de los conductores");
      }
      const conductor = await response.json();

      document.getElementById("nombreEditar").value = conductor.nombre;
      document.getElementById("apellidoEditar").value = conductor.apellido;
      document.getElementById("rutConductorEditar").value = conductor.rut;
      document.getElementById("nombreUsuarioEditar").value = conductor.username;

      $("#btnEditarConductor").off().click(async function () {
          const nuevoNombre = document.getElementById("nombreEditar").value.trim();
          const nuevoApellido = document.getElementById("apellidoEditar").value.trim();
          const nuevoRut = document.getElementById("rutConductorEditar").value.trim();
          const nuevoNombreUsuario = document.getElementById("nombreUsuarioEditar").value.trim();
          const nuevoContrasena = document.getElementById("contrasenaEditar").value.trim();

          if (!nuevoNombre || !nuevoApellido || !nuevoNombreUsuario || !nuevoRut) {
              alert("Por favor complete todos los campos.");
              return;
          }

          try {
            const editarResponse = await fetch(`${urlBack}api/conductores/${id}`, {
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
                password: nuevoContrasena,
              }),
            });
            if (!editarResponse.ok) {
              throw new Error("Error al editar los datos del conductor");
            }
            location.reload();
          } catch (error) {
            console.error("Error al editar los datos del conductor:", error);
          }
      });
    } catch (error) {
      alert("Error al obtener los datos del conductor:", error);
    }
}