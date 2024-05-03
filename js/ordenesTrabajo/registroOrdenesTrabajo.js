//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarOrdenTrabajo() {
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
        const idUsuario = data.userId;

        let ordenTrabajo = {
          fecha: document.getElementById("fecha").value,
          titulo: document.getElementById("titulo").value,
          descripcion: document.getElementById("descripcion").value,
          observaciones: document.getElementById("observaciones").value,
          responsable: idUsuario, //Asignar la id del usuario actual
          establecimiento: parseInt(
            document.getElementById("establecimiento").value
          ), //hay que pasar a int para que el backend pueda tomar el dato bien
          intervencion: obtenerValorSeleccionado(),
        };

        try {
          const request = fetch(`${urlBack}api/ordenTrabajo`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ordenTrabajo),
          });
            console.log(ordenTrabajo);
          // Cerrar el modal
          $("#modalAgregarEstablecimientos").modal("hide");

          // Recargar el datatable
          location.reload();
        } catch (error) {
          console.error("Error:", error.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  } else {
    console.error("No se encontró ningún token almacenado.");
  }
}
//------------------------------------------------------------Obtener valor de intervencion-----------------------------------------------------
function obtenerValorSeleccionado() {
  // Obtener todos los radiobutton con el name "intervencion"
  const radioButtons = document.getElementsByName("intervencion");

  // Variable para almacenar el valor seleccionado
  let valorSeleccionado = null;

  // Recorrer todos los radio buttons
  radioButtons.forEach(function (radioButton) {
    // Verificar si el radio button está seleccionado
    if (radioButton.checked) {
      // Obtener el valor del radio button seleccionado
      valorSeleccionado = radioButton.value;
    }
  });

  // Retornar el valor seleccionado
  return valorSeleccionado;
}
