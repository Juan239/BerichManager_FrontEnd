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
      const username = data.username;
      const userRol = data.userRol;

      if (username !== null) {
        // Actualizar el contenido del span con el nombre de usuario
        document.getElementById("nombreDeUsuario").innerText = username;
      }

      if (
        userRol === "normal" &&
        window.location.pathname === "/DAEM/admin/bajaEquipos.html"
      ) {
        window.location.href = "http://localhost/DAEM/bajaEquipos.html";
      } else if (
        userRol === "admin" &&
        window.location.pathname == "/DAEM/bajaEquipos.html"
      ) {
        window.location.href =
          "http://localhost/DAEM/admin/bajaEquipos.html";
      }

      cargarBajaEqupos(userRol);

    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}
else{
    window.location.href = "http://localhost/DAEM/login.html";
    console.log("No se encuentra el token de acceso");
}

//--------------------------------------------------------------------Configuracion Datatable------------------------------------------------------------------------------
//Aca puedo cambiar la informacion del datatable
$(document).ready(function () {
    $("#tableBajaEquipos").DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.24/i18n/Spanish.json", // Cambiar idioma
      },
      order: [[0, "desc"]],
      paging: true, // Habilitar paginación
      pageLength: 5, // Establecer el número de registros por página en 10
      lengthChange: false, // Deshabilitar la opción de cambiar la cantidad de registros por página
      dom: '<"top"f>rt<"bottom"i>p', //Se define la estructura de la tabla
    });
  });

  