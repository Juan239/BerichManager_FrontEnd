//URL para conectarse al backend
var urlBack = "http://localhost:3000/";
//Obtener el token almacenado en el local storage
const token = localStorage.getItem("token");

//-------------------------------------------------------------------Obtener datos usuario de la sesion----------------------------------------------------------------------
// Verificar si el token existe
document.addEventListener("DOMContentLoaded", function () {
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
        const idUsuario = data.userId;
        const username = data.username;
        const userRol = data.userRol;

        if (username !== null) {
          // Actualizar el contenido del span con el nombre de usuario
          document.getElementById("nombreDeUsuario").innerText = username;
        }

        if (
          userRol === "admin" &&
          window.location.pathname === "/DAEM/index.html"
        ) {
          window.location.href = "http://localhost/DAEM/admin/index.html";
        } else if (
          userRol === "normal" &&
          window.location.pathname === "/DAEM/admin/index.html"
        ) {
          window.location.href = "http://localhost/DAEM/index.html";
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        window.location.href = "http://localhost/DAEM/login.html";
      });
  } else {
    console.error("No se encontró ningún token almacenado.");
    window.location.href = "http://localhost/DAEM/login.html";
  }

  //-------------------------------------------------------------------Obtener datos del dashboard---------------------------------------------------------------------
  // Obtener y mostrar el total de órdenes de trabajo
  fetch(`${urlBack}api/ordenesTotales`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("ordenesTrabajoTotales").innerHTML =
        data[0].total;
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:", error);
    });

  // Obtener y mostrar el total de viajes
  fetch(`${urlBack}api/viajesTotales`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("viajesTotales").innerHTML = data[0].total;
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:", error);
    });

    // Obtener y mostrar el total de ordenes de trabajo del mes actual
    fetch(`${urlBack}api/ordenesMes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("ordenesMes").innerHTML = data[0].total;
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:", error);
    });

    // Obtener y mostrar el total de viajes del mes actual
    fetch(`${urlBack}api/viajesMes`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("viajesMes").innerHTML = data[0].total;
    })
    .catch((error) => {
      console.error("Error al realizar la solicitud:", error);
    });


});

function generarReporte(){
  window.open("reporte.html", "_blank");
}