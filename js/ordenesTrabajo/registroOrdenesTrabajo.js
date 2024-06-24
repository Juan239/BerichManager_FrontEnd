//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarOrdenTrabajo() {
  const token = localStorage.getItem("token");

  // Obtener los valores de los campos de entrada
  const fecha = document.getElementById("fecha").value;
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value.trim();
  const observaciones = document.getElementById("observaciones").value.trim();
  const establecimiento = parseInt(document.getElementById("establecimiento").value);
  const intervencion = obtenerValorSeleccionado();
  const colaborador = document.getElementById("colaborador").value.trim();

  // Verificar que ningún campo esté vacío
  if (fecha && titulo && descripcion && observaciones && establecimiento && intervencion) {
    if (token) {
      try {
        // Obtener datos del usuario
        const response = await fetch(`${urlBack}api/credenciales`, {
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

        const data = await response.json();
        const idUsuario = data.userId;

        const ordenTrabajo = { fecha, titulo, descripcion, observaciones, responsable: idUsuario, establecimiento,intervencion, colaborador};

        // Enviar solicitud al backend
        const request = await fetch(`${urlBack}api/ordenTrabajo`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(ordenTrabajo),
        });

        // Verificar si la solicitud fue exitosa
        if (request.ok) {
          console.log("Orden de trabajo registrada con éxito:", ordenTrabajo);
          $("#modalAgregarEstablecimientos").modal("hide");
          location.reload();
        } else {
          throw new Error("Error al registrar la orden de trabajo");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      console.error("No se encontró ningún token almacenado.");
    }
  } else {
    alert("Por favor, complete todos los campos antes de registrar la orden de trabajo.");
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
