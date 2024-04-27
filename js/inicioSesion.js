document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar que el formulario se envíe normalmente

    const formData = {
      username: document.getElementById("inputUsername").value,
      password: document.getElementById("inputContrasena").value,
    }; // Obtener los datos del formulario

    fetch("http://localhost:3000/api/sesion", {
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

          const rol = data.rol;

          console.log(rol);

          if (rol === "admin") {
            window.location.href = "http://localhost/DAEM/admin/index.html";
          } else if (rol === "normal") {
            window.location.href = "http://localhost/DAEM/index.html";
          } else {
            alert("Error identificando al usuario");
          }

          // window.location.href = "/DAEM/index.html";
        } else {
          // Mostrar un mensaje de error al usuario
          alert("Usuario o contraseña incorrecta");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
