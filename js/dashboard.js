//URL para conectarse al backend
var urlBack = "http://localhost:3000/";
//Obtener el token almacenado en el local storage
const token = localStorage.getItem("token");

//-------------------------------------------------------------------Obtener datos usuario de la sesion----------------------------------------------------------------------
// Verificar si el token existe
document.addEventListener("DOMContentLoaded", function() {
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
        .then(response => {
            // Verificar si la respuesta es exitosa (código de estado 200)
            if (response.ok) {
                // Obtener los datos de la respuesta en formato JSON
                return response.json();
            } else {
                throw new Error("Acceso no autorizado");
            }
        })
        .then(data => {
            // Guardar los datos de la respuesta en variables
            const idUsuario = data.userId;
            const username = data.username;

            if (username !== null) {
                // Actualizar el contenido del span con el nombre de usuario
                document.getElementById('nombreDeUsuario').innerText = username;
            }

        })
        .catch(error => {
            console.error("Error:", error.message);
        });
    } else {
        console.error('No se encontró ningún token almacenado.');
    }
});
