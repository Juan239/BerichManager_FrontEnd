function generarMenu() {
  let urlBack = "http://localhost:3000/";
  const token = localStorage.getItem("token");

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

      const rolInformatica = data.userRolInformatica;
      const rolBitacoras = data.userRolBitacoras;

      //Cuando el usuario es administrador de informatica y bitacoras
      if (rolInformatica === "admin" && rolBitacoras === "admin") {
        let opciones = document.getElementById("accordionSidebar");
        opciones.innerHTML +=
          "<!-- Divider -->" +
          '<hr class="sidebar-divider" />' +
          "<!-- Heading -->" +
          '<div class="sidebar-heading">Administrador</div>' +
          "<!-- Nav Item - Tables -->" +
          '<li class="nav-item" id="usuariosMenu">' +
          '<a class="nav-link" href="usuarios.html">' +
          '<i class="fas fa-fw fa-user"></i>' +
          "<span> Usuarios</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="establecimientosMenu">' +
          '<a class="nav-link" href="establecimientos.html">' +
          '<i class="fas fa-fw fa-university"></i>' +
          "<span> Establecimientos</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="categoriasMenu">' +
          '<a class="nav-link" href="categorias.html">' +
          '<i class="fas fa-wrench"></i>' +
          "<span> Categorias</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="activosMenu">' +
          '<a class="nav-link" href="activos.html">' +
          '<i class="fas fa-wrench"></i>' +
          "<span> Tipo de activos</span>" +
          "</a>" +
          "</li>" +
          "<!-- Newly added HTML -->" +
          '<li class="nav-item" id="areasMenu">' +
          '<a class="nav-link" href="areas.html">' +
          '<i class="fas fa-user-tag"></i>' +
          "<span> Áreas</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="marcasMenu">' +
          '<a class="nav-link" href="marcas.html">' +
          '<i class="fas fa-tags"></i>' +
          "<span> Marcas</span>" +
          "</a>" +
          "</li>" +
          //Opciones bitacoras
          "<!-- Divider -->" +
          '<hr class="sidebar-divider" />' +
          "<!-- Heading -->" +
          '<div class="sidebar-heading">Bitácoras</div>' +
          '<li class="nav-item" id="destinosMenu">' +
          '<a class="nav-link" href="destinos.html">' +
          '<i class="fas fa-tags"></i>' +
          "<span> Destinos</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="vehiculosMenu">' +
          '<a class="nav-link" href="vehiculos.html">' +
          '<i class="fas fa-car"></i>' +
          "<span> Vehículos</span>" +
          "</a>" +
          "</li>" +
          //Boton cerrar menu
          "<!-- Divider -->" +
          '<hr class="sidebar-divider d-none d-md-block" />' +
          "<!-- Sidebar Toggler (Sidebar) -->" +
          '<div class="text-center d-none d-md-inline">' +
          '<button class="rounded-circle border-0" id="sidebarToggle"></button>' +
          "</div>";
        let sidebarToggle = document.getElementById("sidebarToggle");
        if (sidebarToggle) {
          sidebarToggle.addEventListener("click", function () {
            document.body.classList.toggle("sidebar-toggled");
            document
              .getElementById("accordionSidebar")
              .classList.toggle("toggled");
          });
        }
      }
      //Cuando el usuario es administrador de informatica solamente *LISTO
      else if (rolInformatica === "admin" && rolBitacoras === "usuario") {
        let opciones = document.getElementById("accordionSidebar");
        opciones.innerHTML +=
          "<!-- Divider -->" +
          '<hr class="sidebar-divider" />' +
          "<!-- Heading -->" +
          '<div class="sidebar-heading">Administrador</div>' +
          "<!-- Nav Item - Tables -->" +
          '<li class="nav-item" id="usuariosMenu">' +
          '<a class="nav-link" href="usuarios.html">' +
          '<i class="fas fa-fw fa-user"></i>' +
          "<span> Usuarios</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="establecimientosMenu">' +
          '<a class="nav-link" href="establecimientos.html">' +
          '<i class="fas fa-fw fa-university"></i>' +
          "<span> Establecimientos</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="categoriasMenu">' +
          '<a class="nav-link" href="categorias.html">' +
          '<i class="fas fa-wrench"></i>' +
          "<span> Categorias</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="activosMenu">' +
          '<a class="nav-link" href="activos.html">' +
          '<i class="fas fa-wrench"></i>' +
          "<span> Tipo de activos</span>" +
          "</a>" +
          "</li>" +
          "<!-- Newly added HTML -->" +
          '<li class="nav-item" id="areasMenu">' +
          '<a class="nav-link" href="areas.html">' +
          '<i class="fas fa-user-tag"></i>' +
          "<span> Áreas</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="marcasMenu">' +
          '<a class="nav-link" href="marcas.html">' +
          '<i class="fas fa-tags"></i>' +
          "<span> Marcas</span>" +
          "</a>" +
          "</li>" +
          //Boton cerrar menu
          "<!-- Divider -->" +
          '<hr class="sidebar-divider d-none d-md-block" />' +
          "<!-- Sidebar Toggler (Sidebar) -->" +
          '<div class="text-center d-none d-md-inline">' +
          '<button class="rounded-circle border-0" id="sidebarToggle"></button>' +
          "</div>";
        let sidebarToggle = document.getElementById("sidebarToggle");
        if (sidebarToggle) {
          sidebarToggle.addEventListener("click", function () {
            document.body.classList.toggle("sidebar-toggled");
            document
              .getElementById("accordionSidebar")
              .classList.toggle("toggled");
          });
        }
      }
      //Cuando el usuario es administrador de bitacoras solamente
      else if (rolInformatica === "usuario" && rolBitacoras === "admin") {
        let opciones = document.getElementById("accordionSidebar");
        opciones.innerHTML +=
          //Opciones bitacoras
          "<!-- Divider -->" +
          '<hr class="sidebar-divider" />' +
          "<!-- Heading -->" +
          '<div class="sidebar-heading">Bitácoras</div>' +
          '<li class="nav-item" id="destinosMenu">' +
          '<a class="nav-link" href="destinos.html">' +
          '<i class="fas fa-tags"></i>' +
          "<span> Destinos</span>" +
          "</a>" +
          "</li>" +
          '<li class="nav-item" id="vehiculosMenu">' +
          '<a class="nav-link" href="vehiculos.html">' +
          '<i class="fas fa-car"></i>' +
          "<span> Vehículos</span>" +
          "</a>" +
          "</li>" +
          //Boton cerrar menu
          "<!-- Divider -->" +
          '<hr class="sidebar-divider d-none d-md-block" />' +
          "<!-- Sidebar Toggler (Sidebar) -->" +
          '<div class="text-center d-none d-md-inline">' +
          '<button class="rounded-circle border-0" id="sidebarToggle"></button>' +
          "</div>";
        let sidebarToggle = document.getElementById("sidebarToggle");
        if (sidebarToggle) {
          sidebarToggle.addEventListener("click", function () {
            document.body.classList.toggle("sidebar-toggled");
            document
              .getElementById("accordionSidebar")
              .classList.toggle("toggled");
          });
        }
      }
      //Cuando solamente es usuario de ambas areas
      else if (rolInformatica === "usuario" && rolBitacoras === "usuario") {
      }
      asignarItemActivo();
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

function asignarItemActivo() {
  // Obtiene el nombre del archivo actual (por ejemplo, "areas.html")
  let currentPage = window.location.pathname.split("/").pop();

  // Define un objeto que mapea los nombres de archivo a los identificadores únicos de elementos de menú
  let menuItems = {
    "index.html": "dashboardMenu",
    "ordenesTrabajo.html": "informesMenu",
    "bajaEquipos.html": "informesMenu",
    "usuarios.html": "usuariosMenu",
    "establecimientos.html": "establecimientosMenu",
    "categorias.html": "categoriasMenu",
    "activos.html": "activosMenu",
    "areas.html": "areasMenu",
    "marcas.html": "marcasMenu",
    "destinos.html": "destinosMenu",
    "vehiculos.html": "vehiculosMenu",
  };

  // Obtiene el identificador único del elemento de menú correspondiente a la página actual
  let currentMenuItem = menuItems[currentPage];

  // Si se encuentra el identificador único del elemento de menú, agrega la clase "active" a ese elemento
  if (currentMenuItem) {
    let menuItem = document.getElementById(currentMenuItem);
    if (menuItem) {
      menuItem.classList.add("active");
    }
  }
}

// Llamar a la función para generar el menú
generarMenu();
