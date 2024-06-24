var urlBack = "http://localhost:3000/";

//Obtener el token del local storage
const token = localStorage.getItem("token");

//-------------------------------------------------------------Obtener datos vehiculo de la sesion----------------------------------------------
if (token) {
  fetch(`${urlBack}api/credenciales`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
      const username = data.username;
      const userRol = data.userRolBitacoras;

      if (username !== null) {
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      if (userRol !== "admin") {
        window.location.href = "http://localhost/DAEM/berichmanager/index.html";
      }

      cargarVehiculos();
    })
    .catch((error) => {
      window.location.href = "http://localhost/DAEM/login.html";
    });
} else {
  window.location.href = "http://localhost/DAEM/login.html";
}
//-----------------------------------------------------------Configuracion Datatable--------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableVehiculos").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 8
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-------------------------------------------------------------Modal agregar vehiculos--------------------------------------------------------------
$(document).ready(function () {
  $("#btnAgregarVehiculo").click(function () {
    $("#modalAgregarVehiculo").modal("show");
  });
});

//-------------------------------------------------------------Cargar vehiculos--------------------------------------------------------------
async function cargarVehiculos() {
  try {
    const request = await fetch(`${urlBack}api/vehiculos`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!request.ok) {
      throw new Error("No se puede obtener la informacion de los vehiculos");
    }

    const vehiculos = await request.json();

    $("#tableVehiculos").DataTable().clear().draw();

    for (let vehiculo of vehiculos) {
      let botonEliminar = `<a href="#" class="btn btn-danger btn-circle mr-2" onclick="eliminarVehiculo('${vehiculo.ve_patente}')"><i class="fas fa-trash"></i></a>`;
      let botonEditar = `<a href="#" class="btn btn-warning btn-circle mr-2" onclick="editarVehiculo('${vehiculo.ve_patente}')"><i class="fas fa-pen"></i></a>`;

      $("#tableVehiculos")
        .DataTable()
        .row.add([
          vehiculo.ve_patente,
          vehiculo.ve_marca,
          vehiculo.ve_modelo,
          botonEditar + botonEliminar,
        ])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Eliminar vehiculo--------------------------------------------------------------
async function eliminarVehiculo(patente) {
  try {
    if (confirm("¿Estas seguro de eliminar este vehiculo?")) {
      const request = await fetch(`${urlBack}api/vehiculos/${patente}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!request.ok) {
        throw new Error("No se pudo eliminar el vehiculo");
      }
      location.reload();
    }
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Editar vehiculo--------------------------------------------------------------
async function editarVehiculo(patente) {
  try {
    const request = await fetch(`${urlBack}api/vehiculos/${patente}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!request.ok) {
      throw new Error("No se pudo obtener la informacion del vehiculo");
    }

    const vehiculo = await request.json();

    document.getElementById("patenteVehiculoEditar").value =
      vehiculo.ve_patente;
    document.getElementById("marcaVehiculoEditar").value = vehiculo.ve_marca;
    document.getElementById("modeloVehiculoEditar").value = vehiculo.ve_modelo;

    $("#modalEditarVehiculo").modal("show");

    $("#btnEditarVehiculo")
      .off()
      .click(async function () {
        let patente = document
          .getElementById("patenteVehiculoEditar")
          .value.trim();
        let marca = document.getElementById("marcaVehiculoEditar").value.trim();
        let modelo = document
          .getElementById("modeloVehiculoEditar")
          .value.trim();

        if (!patente || !marca || !modelo) {
          alert("Por favor complete todos los campos");
          return;
        }

        let vehiculo = {
          patente: patente,
          marca: marca,
          modelo: modelo,
        };

        try {
          const request = await fetch(`${urlBack}api/vehiculos/${patente}`, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(vehiculo),
          });

          if (!request.ok) {
            throw new Error("No se pudo editar el vehiculo");
          }

          $("#modalEditarVehiculo").modal("hide");
          location.reload();
        } catch (error) {
          alert("Error:", error.message);
          console.error("Error:", error.message);
        }
      });
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}
