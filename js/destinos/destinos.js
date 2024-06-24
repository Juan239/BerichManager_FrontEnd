var urlBack = "http://localhost:3000/";

//Obtener el token del local storage
const token = localStorage.getItem("token");

//-------------------------------------------------------------Obtener datos usuario de la sesion----------------------------------------------
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

      cargarDestinos();
    })
    .catch((error) => {
      window.location.href = "http://localhost/DAEM/login.html";
    });

}else{
  window.location.href = "http://localhost/DAEM/login.html";
}

//-----------------------------------------------------------Configuracion Datatable--------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
  $("#tableDestinos").DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
    },
    paging: true, // Habilitar paginación
    pageLength: 8, // Establecer el número de registros por página en 8
    lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
    dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
  });
});

//-------------------------------------------------------------Modal agregar destino--------------------------------------------------------------
$(document).ready(function () {
  $("#btnAgregarDestino").click(function () {
    $("#modalAgregarDestino").modal("show");
  });
});

//-------------------------------------------------------------Cargar destinos--------------------------------------------------------------
async function cargarDestinos() {
  try {
    const request = await fetch(`${urlBack}api/destinos`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!request.ok) {
      throw new Error("No se puedo obtener la informacion de los destinos");
    }

    const destinos = await request.json();

    $("#tableDestinos").DataTable().clear().draw();

    for (let destino of destinos) {
      let botonEliminar = `<a href="#" class="btn btn-danger btn-circle mr-2" onclick="eliminarDestino(${destino.de_id})"><i class="fas fa-trash"></i></a>`;
      let botonEditar = `<a href="#" class="btn btn-warning btn-circle mr-2" onclick="editarDestino(${destino.de_id})"><i class="fas fa-pen"></i></a>`;

      $("#tableDestinos")
        .DataTable()
        .row.add([
          destino.de_id,
          destino.de_nombre,
          botonEditar + botonEliminar,
        ])
        .draw();
    }
  } catch (error) {
    console.error("Error:", error.message);
    window.location.href = "http://localhost/DAEM/login.html";
  }
}

//-------------------------------------------------------------Eliminar destino--------------------------------------------------------------
async function eliminarDestino(id){
    try {
        if(confirm("¿Está seguro que desea eliminar el destino?")){
            const request = await fetch(`${urlBack}api/destinos/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if(!request.ok){
                throw new Error("No se pudo eliminar el destino");
            }

            location.reload();
        }
    } catch (error) {   
        console.error("Error:", error.message);
        window.location.href = "http://localhost/DAEM/login.html";
    }
}

//-------------------------------------------------------------Editar destino--------------------------------------------------------------
async function editarDestino(id){
    try {
        const request = await fetch(`${urlBack}api/destinos/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if(!request.ok){
            throw new Error("No se pudo obtener la información del destino");
        }

        const destino = await request.json();

        document.getElementById("nombreDestinoEditar").value = destino.de_nombre;
        $("#modalEditarDestino").modal("show");

        $("#btnEditarDestino").off().click(async function(){
            let nombreDestino = document.getElementById("nombreDestinoEditar").value.trim();

            if(!nombreDestino){
                alert("Por favor ingrese el nombre del destino.");
                return;
            }

            let destino = {
                nombre: nombreDestino,
            };

            try {
                const request = await fetch(`${urlBack}api/destinos/${id}`, {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(destino),
                });

                $("#modalEditarDestino").modal("hide");

                location.reload();
            } catch (error) {
                console.error("Error:", error.message);
                window.location.href = "http://localhost/DAEM/login.html";
            }
        });

        $("#modalEditarDestino").modal("show");
    } catch (error) {
        console.error("Error:", error.message);
        window.location.href = "http://localhost/DAEM/login.html";
    }
}