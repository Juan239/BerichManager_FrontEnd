var urlBack = "http://localhost:3000/";

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente

    const formData = {
      username: document.getElementById("inputUsername").value,
      password: document.getElementById("inputContrasena").value,
    }; // Obtener los datos del formulario

    fetch(`${urlBack}api/sesion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Almacena el token y el nombre de usuario en el localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", formData.username);
          localStorage.setItem("idUsuario", data.idUsuario); // Accede a data.idUsuario en lugar de response.body.id
          // Redirigir al usuario a la página de perfil u otra página deseada

          window.location.href = "/DAEM/berichmanager/index.html";
        } else {
          // Mostrar un mensaje de error al usuario
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("No hay conexión con el servidor");
      });
  });
