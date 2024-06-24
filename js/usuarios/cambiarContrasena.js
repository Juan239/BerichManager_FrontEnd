function cambiarContrasena() {
    const token = localStorage.getItem("token");
    if (token) {
        fetch(`${urlBack}api/cambiarContrasena`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                contrasenaActual: document.getElementById("contrasenaActual").value,
                nuevaContrasena: document.getElementById("nuevaContrasena").value,
            }),
        })
        .then(response => {
            if (response.ok) {
                // Cerrar el modal
                $("#modalCambiarContrasena").modal("hide");
                // Mostrar mensaje de éxito
                alert("¡Contraseña cambiada con éxito!");
                document.getElementById("contrasenaActual").value = "";
                document.getElementById("nuevaContrasena").value = "";
            } else {
                // Mostrar mensaje de error si el cambio no es exitoso
                alert("Error al cambiar la contraseña");
            }
        })
        .catch(error => {
            // Mostrar mensaje de error si ocurre un error en la petición
            alert("Error en la petición");
        });
    }
}
