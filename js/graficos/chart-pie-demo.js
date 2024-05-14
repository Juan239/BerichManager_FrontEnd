// Configuración de las fuentes y colores por defecto para los gráficos
Chart.defaults.global.defaultFontFamily = "'Nunito', -apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
Chart.defaults.global.defaultFontColor = "#858796";

document.addEventListener("DOMContentLoaded", function () {
    let myPieChart;

    //---------------------------------------------------- Funciones -----------------------------------------------------

    // Función para obtener los datos del gráfico
    function obtenerGraficos(mesSeleccionado) {
        fetch(`${urlBack}api/graficos/${mesSeleccionado}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener los datos");
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                  if (myPieChart) {
                    myPieChart.destroy();
                }
                    mostrarMensajeSinDatos();

                } else {
                    // Extraer nombres y totales de los datos
                    const nombres = data.map(({ nombre }) => nombre);
                    const totales = data.map(({ total }) => total);

                    // Obtener el contexto del canvas del gráfico
                    const ctx = document.getElementById("myPieChart").getContext("2d");
                    // Destruir el gráfico anterior si existe
                    if (myPieChart) {
                        myPieChart.destroy();
                    }
                    // Crear el nuevo gráfico
                    myPieChart = new Chart(ctx, {
                        type: "doughnut",
                        data: {
                            labels: nombres,
                            datasets: [{
                                data: totales,
                                backgroundColor: ["#4e73df","#1cc88a","#36b9cc","#ff6384","#ff9f40","#4bc0c0","#ffd700","#ff69b4","#6a5acd","#20b2aa","#4682b4","#00ff7f","#ff7f50","#800000","#008080","#7fffd4","#ff8c00","#ff4500","#4682b4","#9370db","#228b22","#daa520","#8b4513","#ff0000","#4b0082","#32cd32","#8a2be2"],
                                hoverBackgroundColor: ["#2e59d9","#17a673","#2c9faf","#ff6384","#ff9f40","#4bc0c0","#ffd700","#ff69b4","#6a5acd","#20b2aa","#4682b4","#00ff7f","#ff7f50","#800000","#008080","#7fffd4","#ff8c00","#ff4500","#4682b4","#9370db","#228b22","#daa520","#8b4513","#ff0000","#4b0082","#32cd32","#8a2be2"],
                                hoverBorderColor: "rgba(234, 236, 244, 1)",
                            }],
                        },
                        options: {
                            maintainAspectRatio: false,
                            aspectRatio: 1,
                            tooltips: {
                                backgroundColor: "rgb(255,255,255)",
                                bodyFontColor: "#858796",
                                borderColor: "#dddfeb",
                                borderWidth: 1,
                                xPadding: 15,
                                yPadding: 15,
                                displayColors: false,
                                caretPadding: 10,
                            },
                            legend: {
                                display: false,
                            },
                            cutoutPercentage: 80,
                        },
                    });
                }
            })
            .catch(error => {
                console.error("Error al realizar la solicitud:", error);
            });
    }

    // Función para mostrar un mensaje cuando no hay datos disponibles
    function mostrarMensajeSinDatos() {
      
        const ctx = document.getElementById("myPieChart").getContext("2d");
        // Limpiar el canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Mostrar el mensaje
        const mensaje = "No hay datos disponibles";
        ctx.font = "20px Arial";
        ctx.fillStyle = "#858796";
        ctx.textAlign = "center";
        ctx.fillText(mensaje, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    // Función para actualizar el dropdown con el mes seleccionado
    function actualizarDropdown(mesSeleccionado) {
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            const mes = parseInt(item.getAttribute('data-value'));
            item.classList.toggle('active', mes === mesSeleccionado);
        });

        // Obtener el nombre del mes seleccionado y actualizar el elemento fuera del dropdown
        document.getElementById('mesSeleccionado').textContent = obtenerNombreMes(mesSeleccionado);
    }

    // Función para obtener el nombre del mes a partir de su número
    function obtenerNombreMes(numeroMes) {
        const meses = ["Total", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return meses[numeroMes];
    }

    //---------------------------------------------------- Lógica principal -----------------------------------------------------

    // Obtener el mes actual
    const mesActual = new Date().getMonth() + 1;
    // Obtener y mostrar los gráficos para el mes actual
    obtenerGraficos(mesActual);
    // Actualizar el dropdown con el mes actual
    actualizarDropdown(mesActual);

    // Agregar eventos de clic a los elementos del dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function() {
            const selectedMonth = parseInt(this.getAttribute('data-value'));
            // Actualizar el dropdown y obtener los gráficos para el mes seleccionado
            actualizarDropdown(selectedMonth);
            obtenerGraficos(selectedMonth);
        });
    });

    // Obtener y mostrar el total de órdenes de trabajo
    fetch(`${urlBack}api/ordenesTotales`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("ordenesTrabajoTotales").innerHTML = data[0].total;
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
        });

    fetch (`${urlBack}api/viajesTotales`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los datos");
        }
        return response.json();
    }).then(data => {
        document.getElementById("viajesTotales").innerHTML = data[0].total;
    }).catch(error => {
        console.error("Error al realizar la solicitud:", error);
    });
});
