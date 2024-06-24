var urlBack = "http://localhost:3000/";

const token = localStorage.getItem("token");

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

      cargarTipoRecomendaciones();
    })
    .catch((error) => {
      console.error("Error:", error.message);
      window.location.href = "http://localhost/DAEM/login.html";
    });
} else {
  console.log("No se encontró ningún token almacenado.");
  window.location.href = "http://localhost/DAEM/login.html";
}

async function cargarTipoRecomendaciones() {
  try {
    const response = await fetch(`${urlBack}api/tipoRecomendaciones`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Destruir DataTable existente si ya está inicializado
      if ($.fn.DataTable.isDataTable("#tableTipoRecomendaciones")) {
        $("#tableTipoRecomendaciones").DataTable().clear().destroy();
      }

      // Inicializar DataTable con los datos recibidos
      $("#tableTipoRecomendaciones").DataTable({
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json",
        },
        paging: true,
        pageLength: 8,
        lengthChange: true,
        data: data,
        columns: [
          { data: "tr_id" },
          { data: "tr_nombre" },
          {
            data: null,
            render: function (data, type, row) {
              let botonEliminar =
                '<a href="#" onClick="eliminarTipoRecomendacion(' +
                data.tr_id +
                ')" class="btn btn-danger btn-circle mr-2"><i class="fas fa-trash"></i></a>';
              let botonEditar =
                '<a href="#" onClick="editarTipoRecomendacion(' +
                data.tr_id +
                ')" class="btn btn-warning btn-circle mr-2"><i class="fas fa-pen"></i></a>';
              return botonEditar + botonEliminar;
            },
          },
        ],
      });
    } else {
      throw new Error("Acceso no autorizado");
    }
  } catch (error) {
    console.error("Error:", error.message);
    // Redirigir al usuario a la página de inicio de sesión en caso de error, el error obtenido es por la invalidez del token o la ausencia de este
    // window.location.href = "http://localhost/DAEM/login.html";
  }
}

async function eliminarTipoRecomendacion(id) {
  try {
    Swal.fire({
      title: "¿Estas seguro de eliminar?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      fetch(`${urlBack}api/tipoRecomendaciones/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminado",
          text: "Este dato ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 1000,
        }).then(() => {
            location.reload();
            });
      }
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function editarTipoRecomendacion(id) {
  try {
    const response = await fetch(`${urlBack}api/tipoRecomendaciones/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar el tipo de recomendación");
    }

    const tipoRecomendacion = await response.json();

    $("#modalEditarTipoRecomendacion").modal("show");
    document.getElementById("nombreTipoRecomendacionEditar").value = tipoRecomendacion[0].tr_nombre;

    $("#btnEditarTipoRecomendacion").off().click(async function () {
      const nuevoNombreTipoRecomendacion = document.getElementById("nombreTipoRecomendacionEditar").value.trim();

      if (!nuevoNombreTipoRecomendacion) {
        alert("Por favor ingrese un nuevo nombre para el tipo de recomendación.");
        return;
      }

      try {
        const response = await fetch(`${urlBack}api/tipoRecomendaciones/${id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nombre: nuevoNombreTipoRecomendacion,
          }),
        });

        if (!response.ok) {
          throw new Error("Error al editar el tipo de recomendación");
        }

        $("#modalEditarTipoRecomendacion").modal("hide");
        location.reload();
      } catch (error) {
        console.error("Error:", error.message);
      }
    });


  } catch (error) {
    console.log("Error:", error.message);
  }
}
