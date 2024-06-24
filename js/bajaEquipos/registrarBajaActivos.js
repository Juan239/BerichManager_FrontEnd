//URL para conectarse al backend
var urlBack = "http://localhost:3000/";

async function registrarBajaEquipo() {
    // Obtener el token
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
            const idUsuario = data.userId;

            // Obtener los valores de los campos
            let fecha = document.getElementById("fecha").value;
            let tipoActivo = document.getElementById("tipoActivo").value;
            let marca = document.getElementById("marca").value;
            let modelo = document.getElementById("modelo").value.trim();
            let ubicacion = parseInt(document.getElementById("establecimiento").value);
            let relacionSolicitud = document.getElementById("relacionSolicitud").value.trim();
            let detalle = document.getElementById("detalle").value.trim();
            let conceptoTecnico = document.getElementById("conceptoTecnico").value.trim();

            // Verificar que los campos obligatorios no estén vacíos
            if (!fecha || !tipoActivo || !marca || !modelo || isNaN(ubicacion) || !relacionSolicitud || !detalle || !conceptoTecnico) {
                alert("Por favor complete todos los campos obligatorios.");
                return;
            }

            let bajaActivo = {
                fecha: fecha,
                tipoActivo: tipoActivo,
                marca: marca,
                modelo: modelo,
                ubicacion: ubicacion,
                relacionSolicitud: relacionSolicitud,
                detalle: detalle,
                conceptoTecnico: conceptoTecnico,
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
    } else {
        console.log("No se encuentra el token de acceso");
    }
}
