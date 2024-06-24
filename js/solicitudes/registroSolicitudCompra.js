var urlBack = "http://localhost:3000/";

async function registrarSolicitud() {
    const token = localStorage.getItem("token");

    // Obtener los valores de los campos de entrada
    const fecha = document.getElementById("fecha").value;
    const establecimiento = parseInt(document.getElementById("establecimiento").value);
    const mensaje = document.getElementById("mensajeSolicitud").value.trim();

    if(!fecha || !establecimiento || !mensaje){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Rellene todos los campos para continuar",
          });
        return;
    }

    try{

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



        fetch(`${urlBack}api/solicitudes/compra`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({fecha, establecimiento, solicitud: mensaje, responsable: idUsuario})
          })
          .then((response) => {
            if(response.ok){
                Swal.fire({
                    icon: "success",
                    title: "Solicitud registrada",
                    text: "La solicitud de compra ha sido registrada con éxito",
                    showConfirmButton: false,
                    timer: 1000
                  }).then(() => {
                    $("#modalAgregarSolicitud").modal("hide");
                    location.reload();
                  });
            }
            else{
                throw new Error("Error al registrar la solicitud de compra");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });

    }catch(error){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error,
          });
    }


}