let urlBack = "http://localhost:3000/";

// Configuración de las fuentes y colores por defecto para los gráficos
Chart.defaults.global.defaultFontFamily =
    "'Nunito', -apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
Chart.defaults.global.defaultFontColor = "#858796";

// Función para formatear números
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + "").replace(",", "").replace(" ", "");
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
        dec = typeof dec_point === "undefined" ? "." : dec_point,
        s = "",
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return "" + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
}

let myBarChart;
let myPieChart1;
let myPieChart2;
let myPieChart3;

obtenerDatos();
obtenerGraficos();

function obtenerDatos() {
    fetch(`${urlBack}api/ordenesTotalesPorMes/2024`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            return response.json();
        })
        .then((data) => {
            if (data.length === 0) {
                if (myBarChart) {
                    myBarChart.destroy();
                }
            } else {
                const mes = data.map(({ mes }) => mes);
                const totales = data.map(({ total }) => total);

                const ctx = document.getElementById("myBarChart").getContext("2d");
                if (myBarChart) {
                    myBarChart.destroy();
                }
                myBarChart = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre",
                        ],
                        datasets: [
                            {
                                label: "Total",
                                backgroundColor: "#4e73df",
                                hoverBackgroundColor: "#2e59d9",
                                borderColor: "#4e73df",
                                data: totales,
                            },
                        ],
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                left: 10,
                                right: 25,
                                top: 25,
                                bottom: 0,
                            },
                        
                        },
                        scales: {
                            xAxes: [
                                {
                                    time: {
                                        unit: "month",
                                    },
                                    gridLines: {
                                        display: false,
                                    
                                    },
                                    ticks: {
                                        maxTicksLimit: 12,
                                        fontSize: 16,
                                        fontColor: "#000000"
                                    },
                                    maxBarThickness: 25,
                                },
                            ],
                            yAxes: [
                                {
                                    ticks: {
                                        min: 0,
                                        max: 30,
                                        maxTicksLimit: 15,
                                        padding: 10,
                                        fontSize: 16,
                                        fontColor: "#000000"
                                    },
                                    gridLines: {
                                        color: "rgb(100, 100, 100, 0.5)",
                                        zeroLineColor: "rgb(234, 236, 244)",
                                        drawBorder: true,
                                        borderDash: [2],
                                        zeroLineBorderDash: [2],
                                    },
                                },
                            ],
                        },
                        legend: {
                            display: false,
                        },
                        tooltips: {
                            titleMarginBottom: 10,
                            titleFontColor: "#6e707e",
                            titleFontSize: 14,
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "rgb(0,0,0)",
                            borderColor: "#000000",
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            caretPadding: 10,
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    var value = data.datasets[0].data[tooltipItem.index];
                                    return 'Total: ' + number_format(value, 0, ',', '.');
                                }
                            }
                        },
                    },
                });
            }
        })
        .catch();
}

 // Función para obtener los datos del gráfico
function obtenerGraficos(mesSeleccionado) {
    fetch(`${urlBack}api/reporteOrdenesTrabajo`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos");
            }
            return response.json();
        })
        .then((data) => {

            if (data["trimestre1"].length === 0) {
                destruirGraficos();
                mostrarMensajeSinDatos();
            } else {
                const nombresTrimestre1 = data["trimestre1"].map(({ nombre }) => nombre);
                const totalesTrimestre1 = data["trimestre1"].map(({ total }) => total);

                const nombresTrimestre2 = data["trimestre2"].map(({ nombre }) => nombre);
                const totalesTrimestre2 = data["trimestre2"].map(({ total }) => total);

                const nombresTrimestre3 = data["trimestre3"].map(({ nombre }) => nombre);
                const totalesTrimestre3 = data["trimestre3"].map(({ total }) => total);


                const ctx1 = document.getElementById("myPieChart1").getContext("2d");
                const ctx2 = document.getElementById("myPieChart2").getContext("2d");
                const ctx3 = document.getElementById("myPieChart3").getContext("2d");

                destruirGraficos();


                crearGrafico(ctx1, nombresTrimestre1, totalesTrimestre1);
                crearGrafico(ctx2, nombresTrimestre2, totalesTrimestre2);
                crearGrafico(ctx3, nombresTrimestre3, totalesTrimestre3);

                agregarLeyenda(nombresTrimestre1, totalesTrimestre1, "legendContainer1");
                agregarLeyenda(nombresTrimestre2, totalesTrimestre2, "legendContainer2");
                agregarLeyenda(nombresTrimestre3, totalesTrimestre3, "legendContainer3");
            }
        })
        .catch((error) => {
            console.error("Error al realizar la solicitud:", error);
        });
}

function destruirGraficos() {
    if (myPieChart1) {
        myPieChart1.destroy();
    }
    if (myPieChart2) {
        myPieChart2.destroy();
    }
    if (myPieChart3) {
        myPieChart3.destroy();
    }
    document.getElementById("legendContainer1").innerHTML = "";
    document.getElementById("legendContainer2").innerHTML = "";
    document.getElementById("legendContainer3").innerHTML = "";
}

function obtenerNombres(trimestre) {
    return trimestre.map(({ nombresTrimestre }) => nombresTrimestre);
}

function obtenerTotales(trimestre) {
    return trimestre.map(({ totalesTrimestre }) => totalesTrimestre);
}

function crearGrafico(ctx, nombres, totales) {
    new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: nombres,
            datasets: [
                {
                    data: totales,
                    backgroundColor: obtenerColores(),
                    hoverBackgroundColor: obtenerColores(),
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                },
            ],
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
                displayColors: true,
                caretPadding: 10,
            },
            legend: {
                display: false,
            },
            cutoutPercentage: 80,
        },
    });
}

function obtenerColores() {
    return [
        "#4e73df",
        "#1cc88a",
        "#36b9cc",
        "#ff6384",
        "#ff9f40",
        "#4bc0c0",
        "#ffd700",
        "#ff69b4",
        "#6a5acd",
        "#20b2aa",
        "#4682b4",
        "#00ff7f",
        "#ff7f50",
        "#800000",
        "#008080",
        "#7fffd4",
        "#ff8c00",
        "#ff4500",
        "#4682b4",
        "#9370db",
        "#228b22",
        "#daa520",
        "#8b4513",
        "#ff0000",
        "#4b0082",
        "#32cd32",
        "#8a2be2",
    ];
}

function agregarLeyenda(nombres, totales, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (nombres.length === 0) {
        container.innerHTML = "<span style='font-size: 18px;'>No hay datos disponibles</span>";
    } else {
        for (let i = 0; i < nombres.length; i++) {
            const legendItem = document.createElement("div");
            legendItem.classList.add("legend-item");

            const colorBox = document.createElement("div");
            colorBox.classList.add("color-box");
            colorBox.style.backgroundColor = obtenerColores()[i];

            const label = document.createElement("span");
            label.textContent = nombres[i] + " - " + totales[i];
            label.style.color = "black";

            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            container.appendChild(legendItem);
        }
    }
}

function mostrarMensajeSinDatos() {
    const legendContainer1 = document.getElementById("legendContainer1");
    const legendContainer2 = document.getElementById("legendContainer2");
    const legendContainer3 = document.getElementById("legendContainer3");
    legendContainer1.innerHTML = "<span style='font-size: 18px;'>No hay datos disponibles</span>";
    legendContainer2.innerHTML = "<span style='font-size: 18px;'>No hay datos disponibles</span>";
    legendContainer3.innerHTML = "<span style='font-size: 18px;'>No hay datos disponibles</span>";
}
  
 /*  // Función para actualizar el dropdown con el mes seleccionado
  function actualizarDropdown(mesSeleccionado) {
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      const mes = parseInt(item.getAttribute("data-value"));
      item.classList.toggle("active", mes === mesSeleccionado);
    });
  
    // Obtener el nombre del mes seleccionado y actualizar los elementos fuera del dropdown
    document.getElementById("mesSeleccionado1").textContent =
      obtenerNombreMes(mesSeleccionado);
    document.getElementById("mesSeleccionado2").textContent =
      obtenerNombreMes(mesSeleccionado);
    document.getElementById("mesSeleccionado3").textContent =
      obtenerNombreMes(mesSeleccionado);
  }
  
  // Función para obtener el nombre del mes a partir de su número
  function obtenerNombreMes(numeroMes) {
    const meses = [
      "Año completo",
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
      "1° Trimestre",
      "2° Trimestre",
      "3° Trimestre",
    ];
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
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", function () {
      const selectedMonth = parseInt(this.getAttribute("data-value"));
      // Actualizar el dropdown y obtener los gráficos para el mes seleccionado
      actualizarDropdown(selectedMonth);
      obtenerGraficos(selectedMonth);
    });
  }); */
  