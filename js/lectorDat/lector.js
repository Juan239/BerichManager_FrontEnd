let fileContent = ""; // Variable para almacenar el contenido del archivo

// Event listener para el cambio en el campo de entrada de archivo
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // Obtiene el archivo seleccionado
    if (!file) {
      // Verifica si no se seleccionó ningún archivo
      return; // Termina la función si no se seleccionó ningún archivo
    }

    const reader = new FileReader(); // Crea un FileReader para leer el archivo

    // Función que se ejecuta cuando el archivo se ha cargado
    reader.onload = function (e) {
      fileContent = e.target.result; // Almacena el contenido del archivo en la variable fileContent
      filtrarDatos(); // Llama a la función filtrarDatos para mostrar los datos filtrados
    };

    // Función que maneja errores durante la lectura del archivo
    reader.onerror = function (e) {
      console.error("Error leyendo el archivo", e); // Imprime el error en la consola
      alert("Error leyendo el archivo"); // Muestra una alerta con el mensaje de error
    };

    reader.readAsText(file); // Lee el archivo como texto
  });

//-------------------------------------------------------------------Asignar funcion a los botones------------------------------------------------------------------

// Event listener para el botón de filtrado
document.getElementById("filterButton").addEventListener("click", function () {
  filtrarDatos(); // Llama a la función filtrarDatos para mostrar los datos filtrados por fecha
});

// Event listener para el botón de mostrar todos los datos
document.getElementById("todosLosDatos").addEventListener("click", function () {
  mostrarTodosLosDatos(); // Llama a la función mostrarTodosLosDatos para mostrar todos los datos del archivo
});

//-----------------------------------------------------------Función para mostrar los datos filtrados----------------------------------------------------------------
function filtrarDatos() {
  const startDateInput = document.getElementById("startDate").value; // Obtiene la fecha de inicio seleccionada
  const endDateInput = document.getElementById("endDate").value; // Obtiene la fecha de fin seleccionada

  // Verifica si falta alguno de los datos necesarios para filtrar
  if (!fileContent || !startDateInput || !endDateInput) {
    throw new Error("Faltan datos necesarios para filtrar."); // Lanza una excepción con un mensaje de error 
  }

  // Convierte las fechas de inicio y fin a objetos Date
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);
  endDate.setDate(endDate.getDate() + 1); // Incluye la fecha de fin en el rango

  const lines = fileContent.split("\n"); // Divide el contenido del archivo en líneas
  const data = lines
    .map((line) => line.split("\t"))
    .filter((row) => row.length > 1); // Divide cada línea en columnas y filtra las líneas vacías

  // Filtra los datos por el rango de fechas seleccionado
  const filteredData = data.filter((row) => {
    const date = new Date(row[1]); // Convierte la fecha en la segunda columna a un objeto Date
    return date >= startDate && date < endDate; // Retorna true si la fecha está dentro del rango
  });

  if (filteredData.length === 0) {
    console.log("No se encontraron datos en el rango de fechas seleccionado."); // Imprime un mensaje en la consola si no se encontraron datos
    alert("No se encontraron datos en el rango de fechas seleccionado."); // Muestra una alerta con el mensaje de error
  }

  // Objeto para almacenar los datos agrupados por ID y fecha, con hora de entrada y salida
  const groupedData = {};
  filteredData.forEach((row) => {
    const id = row[0]; // Obtiene el ID de la primera columna
    const date = row[1].split(" ")[0]; // Obtiene la fecha sin la hora
    const time = row[1].split(" ")[1]; // Obtiene la hora

    // Verifica si aún no hay datos agrupados para ese ID
    if (!groupedData[id]) {
      groupedData[id] = {}; // Inicializa el objeto para ese ID
    }

    // Verifica si aún no hay datos agrupados para ese ID y fecha
    if (!groupedData[id][date]) {
      groupedData[id][date] = { entrada: null, salida: null }; // Inicializa el objeto para ese ID y fecha
    }

    // Verifica si aún no se ha registrado la hora de entrada
    if (!groupedData[id][date].entrada) {
      groupedData[id][date].entrada = time; // Registra la hora como hora de entrada
    } 
    // Si ya se ha registrado la hora de entrada
    else {
      groupedData[id][date].salida = time; // Registra la hora como hora de salida
    }
  });

  // Elemento donde se mostrarán los datos
  const previsualizacion = document.getElementById("fileContent");
  previsualizacion.innerHTML = ""; // Limpia el contenido previo

  // Recorre los datos agrupados y los muestra en el elemento previsualizacion
  for (const id in groupedData) {
    if (groupedData.hasOwnProperty(id)) {
      const idElement = document.createElement("span"); // Crea un elemento span para mostrar el ID
      idElement.classList.add("id"); // Añade la clase 'id' al elemento
      idElement.textContent = `\nID: ${id}\n`; // Establece el texto del elemento con el ID
      idElement.style.color = "blue"; // Establece el color del texto en azul

      previsualizacion.appendChild(idElement); // Agrega el elemento al contenedor
      for (const date in groupedData[id]) {
        // Recorre las fechas para este ID
        if (groupedData[id].hasOwnProperty(date)) {
          const entry = groupedData[id][date]; // Obtiene la entrada correspondiente a esta fecha
          const entryElement = document.createElement("span"); // Crea un elemento span para mostrar la entrada
          const entrada = entry.entrada ? entry.entrada : "No registró"; // Verifica si hay hora de entrada, si no, muestra "no registró"
          const salida = entry.salida ? entry.salida : "No registró"; // Verifica si hay hora de salida, si no, muestra "no registró"
          const hoursWorked = calculateHoursWorked(entrada, salida); // Calcula las horas trabajadas
          entryElement.textContent += `, Horas trabajadas: ${hoursWorked}`; // Agrega las horas trabajadas al texto del elemento

          entryElement.textContent = `Fecha: ${date}, Entrada: ${entrada}, Salida: ${salida}, Horas trabajadas: ${hoursWorked}\n`; // Establece el texto del elemento con la fecha, hora de entrada y salida
          previsualizacion.appendChild(entryElement); // Agrega el elemento al contenedor
        }
      }
    }
  }
}

//-----------------------------------------------------------Función para mostrar todos los datos del archivo----------------------------------------------------------------
function mostrarTodosLosDatos() {
  // Verifica si hay contenido en el archivo
  if (!fileContent) {
    throw new Error("No se ha cargado ningún archivo."); // Lanza una excepción con un mensaje de error
  }

  // Elemento donde se mostrarán los datos
  const previsualizacion = document.getElementById("fileContent");
  previsualizacion.innerHTML = ""; // Limpia el contenido previo

  const lines = fileContent.split("\n"); // Divide el contenido del archivo en líneas
  const data = lines
    .map((line) => line.split("\t"))
    .filter((row) => row.length > 1); // Divide cada línea en columnas y filtra las líneas vacías

  // Objeto para almacenar los datos agrupados por ID y fecha, con hora de entrada y salida
  const groupedData = {};
  data.forEach((row) => {
    const id = row[0]; // Obtiene el ID de la primera columna
    const date = row[1].split(" ")[0]; // Obtiene la fecha sin la hora
    const time = row[1].split(" ")[1].split(":").slice(0, 2).join(":"); // Obtiene la hora sin los segundos
    if (!groupedData[id]) {
      // Verifica si aún no hay datos agrupados para ese ID
      groupedData[id] = {}; // Inicializa el objeto para ese ID
    }
    if (!groupedData[id][date]) {
      // Verifica si aún no hay datos agrupados para ese ID y fecha
      groupedData[id][date] = { entrada: null, salida: null }; // Inicializa el objeto para ese ID y fecha
    }
    if (!groupedData[id][date].entrada) {
      // Verifica si aún no se ha registrado la hora de entrada
      groupedData[id][date].entrada = time; // Registra la hora como hora de entrada
    } else {
      // Si ya se ha registrado la hora de entrada
      groupedData[id][date].salida = time; // Registra la hora como hora de salida
    }
  });

  // Recorre los datos agrupados y los muestra en el elemento previsualizacion
  for (const id in groupedData) {
    if (groupedData.hasOwnProperty(id)) {
      const idElement = document.createElement("span"); // Crea un elemento span para mostrar el ID
      idElement.classList.add("id"); // Añade la clase 'id' al elemento
      idElement.textContent = `\nID: ${id}\n`; // Establece el texto del elemento con el ID
      idElement.style.color = "blue"; // Establece el color del texto en azul
      previsualizacion.appendChild(idElement); // Agrega el elemento al contenedor
      for (const date in groupedData[id]) {
        // Recorre las fechas para este ID
        if (groupedData[id].hasOwnProperty(date)) {
          const entry = groupedData[id][date]; // Obtiene la entrada correspondiente a esta fecha
          const entryElement = document.createElement("span"); // Crea un elemento span para mostrar la entrada
          const entrada = entry.entrada ? entry.entrada : "No registró"; // Verifica si hay hora de entrada, si no, muestra "no registró"
          const salida = entry.salida ? entry.salida : "No registró"; // Verifica si hay hora de salida, si no, muestra "no registró"
          entryElement.textContent = `Fecha: ${date}, Entrada: ${entrada}, Salida: ${salida}\n`; // Establece el texto del elemento con la fecha, hora de entrada y salida
          previsualizacion.appendChild(entryElement); // Agrega el elemento al contenedor
        }
      }
    }
  }
}

//---------------------------------------------------------------------------Generar PDF-------------------------------------------------------------------------------
document.getElementById("generatePdfButton").addEventListener("click", function () {
    const idToGeneratePdfFor = document.getElementById("idForPdf").value.trim(); // Obtiene el ID ingresado por el usuario
    if (!idToGeneratePdfFor) {
      throw new Error("Ingrese un ID válido para generar el PDF."); // Lanza una excepción con un mensaje de error si no se ingresó un ID
    }

    const { jsPDF } = window.jspdf; // Obtiene la instancia de jsPDF
    const doc = new jsPDF(); // Crea un nuevo documento PDF

    const dataToPdf = getDataForId(idToGeneratePdfFor); // Obtiene los datos para el ID especificado
    if (!dataToPdf) {
      // Si no hay datos para el ID especificado
      throw new Error("No se encontraron datos para el ID especificado."); // Lanza una excepción con un mensaje de error 
    }

    // Agrega un título al PDF
    doc.setFontSize(18);
    doc.text(`Reporte de asistencia para ID: ${idToGeneratePdfFor}`, 14, 22);

    // Define las columnas y los datos para la tabla
    const columns = ["Fecha", "Día", "Entrada", "Salida", "Horas Trabajadas"];
    const rows = [];
    let totalHorasTrabajadas = 0;
    let totalMinutosTrabajados = 0;
    console.log("Total de horas trabajadas: ", totalHorasTrabajadas);

    for (const date in dataToPdf) {
      if (dataToPdf.hasOwnProperty(date)) {
        const entry = dataToPdf[date];
        let horasTrabajadas = calculateHoursWorked(entry.entrada, entry.salida);
        if (/^\d{1,2}:\d{2}$/.test(horasTrabajadas)) {
          const [hours, minutes] = horasTrabajadas.split(":");
          totalHorasTrabajadas += parseInt(hours);
          totalMinutosTrabajados += parseInt(minutes);
        } else {
          horasTrabajadas = "Error";
        }
        rows.push([
          date,
          entry.dayOfWeek,
          entry.entrada || "Error",
          entry.salida || "Error",
          horasTrabajadas,
        ]);
      }
    }

    // Convertir los minutos a horas y minutos
    totalHorasTrabajadas += Math.floor(totalMinutosTrabajados / 60);
    totalMinutosTrabajados = totalMinutosTrabajados % 60;

    // Formatear las horas y minutos en el formato deseado
    const totalHorasTrabajadasFormatted = `${totalHorasTrabajadas} horas : ${totalMinutosTrabajados
      .toString()
      .padStart(2, "0")} minutos`;

    // Usa autoTable para crear la tabla
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 10 },
      pageBreak: "auto",
    });

    // Agrega el total de horas trabajadas al final del PDF
    doc.setFontSize(12);
    doc.text(
      `Total de horas trabajadas: ${totalHorasTrabajadasFormatted}`,
      14,
      doc.autoTable.previous.finalY + 10
    );

    // Guarda el PDF
    doc.save(`Registro de asistencia ${idToGeneratePdfFor}.pdf`);
  });


//-------------------------------------------------------Función para obtener los datos para un ID específico-------------------------------------------------------
function getDataForId(id) {
  try {
    const startDate = document.getElementById("startDate").value; // Obtiene la fecha de inicio seleccionada
    const endDate = document.getElementById("endDate").value; // Obtiene la fecha de fin seleccionada

    if (!fileContent || !startDate || !endDate) {
      throw new Error("Faltan datos necesarios para obtener los datos del ID."); // Lanza una excepción con un mensaje de error personalizado si falta algún dato
    }

    const lines = fileContent.split("\n"); // Divide el contenido del archivo en líneas
    const data = lines
      .map((line) => line.split("\t")) // Divide cada línea en columnas utilizando el separador de tabulación
      .filter((row) => row.length > 1); // Filtra las líneas vacías

    const filteredData = data.filter((row) => {
      const date = new Date(row[1]); // Convierte la fecha en la segunda columna a un objeto Date
      const formattedDate = date.toISOString().split("T")[0]; // Obtiene la fecha en formato YYYY-MM-DD
      return (
        row[0].trim() === id && // Compara el ID en la primera columna con el ID especificado
        formattedDate >= startDate && // Compara la fecha con la fecha de inicio seleccionada
        formattedDate <= endDate // Compara la fecha con la fecha de fin seleccionada
      ); // Filtra los datos para el ID y el rango de fechas especificados
    });

    if (filteredData.length === 0) {
      throw new Error(
        "No se encontraron datos para el ID y el rango de fechas especificados."
      ); // Lanza una excepción con un mensaje de error si no se encontraron datos
    }

    // Inicializa todas las fechas en el rango como ausentes
    const groupedData = {};
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Obtiene la fecha en formato YYYY-MM-DD
      groupedData[formattedDate] = {
        dayOfWeek: getDayName(formattedDate), // Obtiene el nombre del día de la semana para la fecha
        entrada: "Ausente", // Inicializa la hora de entrada como "Ausente"
        salida: "Ausente", // Inicializa la hora de salida como "Ausente"
      };
      currentDate.setDate(currentDate.getDate() + 1); // Avanza al siguiente día
    }

    console.log(filteredData);

    // Llena las fechas con datos reales
    filteredData.forEach((row) => {
      try {
        const date = row[1].split(" ")[0]; // Obtiene la fecha sin la hora
        const time = row[1].split(" ")[1].split(":").slice(0, 2).join(":"); // Obtiene la hora sin los segundos

        if (!groupedData[date]) {
          throw new Error(`Fecha ${date} no encontrada en groupedData.`); // Lanza una excepción si la fecha no se encuentra en groupedData
        }

        if (groupedData[date].entrada === "Ausente") {
          groupedData[date].entrada = time; // Asigna la hora como hora de entrada si aún no se ha asignado una hora de entrada para esa fecha
        } else {
          groupedData[date].salida = time; // Asigna la hora como hora de salida si ya se ha asignado una hora de entrada para esa fecha
        }
      } catch (error) {
        console.error(`Error llenando datos para el registro: ${row}`, error);
      }
    });

    return groupedData; // Retorna los datos agrupados por fecha con las horas de entrada y salida correspondientes
  } catch (error) {
    console.error("Error en getDataForId:", error);
    throw error;
  }
}

/* function calculateHoursWorked(entrada, salida) {
  console.log("Se está ejecutando la primera función");
  if (entrada === "Ausente" || salida === "Ausente") return "0"; // Maneja los casos de ausencia

  const [entradaHoras, entradaMinutos] = entrada.split(":").map(Number);
  const [salidaHoras, salidaMinutos] = salida.split(":").map(Number);
  const horasTrabajadas =
    salidaHoras + salidaMinutos / 60 - (entradaHoras + entradaMinutos / 60);
  return `${horasTrabajadas.toFixed(2)}`; // Retorna las horas trabajadas en formato 8.32
} */

// Función para obtener el nombre del día de una fecha
function getDayName(dateString) {
  const date = new Date(dateString);
  const days = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  return days[date.getDay()];
}

// Función para calcular las horas trabajadas
function calculateHoursWorked(entrada, salida) {
  console.log("Se está ejecutando la segunda función");
  if (salida === "No registró" || entrada === "No registró") return "Error"; // Verifica si no se registró la entrada o salida
  const entradaTime = new Date(`2000-01-01 ${entrada}`); // Crea un objeto Date con la hora de entrada
  const salidaTime = new Date(`2000-01-01 ${salida}`); // Crea un objeto Date con la hora de salida
  const milliseconds = salidaTime - entradaTime; // Calcula la diferencia en milisegundos
  const hours = Math.floor(milliseconds / (1000 * 60 * 60)); // Convierte los milisegundos a horas
  const minutes = Math.round((milliseconds % (1000 * 60 * 60)) / (1000 * 60)); // Calcula los minutos restantes
  return `${hours}:${minutes.toString().padStart(2, "0")}`; // Retorna las horas y minutos en formato 8:32
}
