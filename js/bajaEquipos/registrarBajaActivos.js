//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarBajaEquipo() {
    if(token){
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
            const idUsuario = data.userId;

            let bajaActivo = {
                fecha: document.getElementById("fecha").value,
                tipoActivo: document.getElementById("tipoActivo").value,
                marca: document.getElementById("marca").value,
                modelo: document.getElementById("modelo").value,
                ubicacion: parseInt(document.getElementById("establecimiento").value),
                relacionSolicitud: document.getElementById("relacionSolicitud").value,
                detalle: document.getElementById("detalle").value,
                conceptoTecnico: document.getElementById("conceptoTecnico").value,
                responsable: idUsuario,
            };
            try {
                const request = fetch(`${urlBack}api/bajaEquipos`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(bajaActivo),
                });
                console.log(bajaActivo);
                $("#modalAgregarBajaActivo").modal("hide");
                location.reload();
            } catch (error) {
                console.error("Error:", error.message);
            }
        })
        .catch((error) => {
            console.error("Error:", error.message);
        });
    }else{
        console.log("No se encuentra el token de acceso");
    }
}