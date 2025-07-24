const contHabitaciones = document.getElementById("cont-habitaciones");
const API = "https://servidor-j7p3.onrender.com";

// Hacer las funciones accesibles globalmente
window.filtrarHabitaciones = async () => {
  console.log("Iniciando filtrarHabitaciones"); // Depuración adicional
  const cantPersonas = parseInt(
    document.getElementById("cantPersonas")?.value || "",
    10
  );
  const llegada = document.getElementById("llegada")?.value || "";
  const salida = document.getElementById("salida")?.value || "";

  console.log("Filtrando con:", { cantPersonas, llegada, salida }); // Depuración detallada

  if (
    !cantPersonas ||
    isNaN(cantPersonas) ||
    cantPersonas <= 0 ||
    !llegada ||
    !salida ||
    new Date(llegada) >= new Date(salida)
  ) {
    console.log("Validación fallida:", { cantPersonas, llegada, salida });
    alert(
      "Por favor, ingresa un número válido de personas (> 0) y fechas correctas (llegada antes de salida)."
    );
    return;
  }

  try {
    const response = await fetch(`${API}/habitaciones`);
    const habitaciones = await response.json();
    console.log("Datos de la API:", habitaciones); // Depuración

    const habitacionesFiltradas = Array.isArray(habitaciones)
      ? habitaciones.filter((habitacion) => {
          const capacidadOk = habitacion.capacidad >= cantPersonas;
          const fechasOk = !(habitacion.fechas_ocupadas || []).some((f) => {
            const fechaInicio = new Date(f.fecha_entrada);
            const fechaFin = new Date(f.fecha_salida);
            const fechaLlegada = new Date(llegada);
            const fechaSalida = new Date(salida);
            return (
              (fechaLlegada >= fechaInicio && fechaLlegada <= fechaFin) ||
              (fechaSalida >= fechaInicio && fechaSalida <= fechaFin) ||
              (fechaLlegada <= fechaInicio && fechaSalida >= fechaFin)
            );
          });
          return capacidadOk && fechasOk && habitacion.disponible;
        })
      : (habitaciones.habitaciones || []).filter((habitacion) => {
          const capacidadOk = habitacion.capacidad >= cantPersonas;
          const fechasOk = !(habitacion.fechas_ocupadas || []).some((f) => {
            const fechaInicio = new Date(f.fecha_entrada);
            const fechaFin = new Date(f.fecha_salida);
            const fechaLlegada = new Date(llegada);
            const fechaSalida = new Date(salida);
            return (
              (fechaLlegada >= fechaInicio && fechaLlegada <= fechaFin) ||
              (fechaSalida >= fechaInicio && fechaSalida <= fechaFin) ||
              (fechaLlegada <= fechaInicio && fechaSalida >= fechaFin)
            );
          });
          return capacidadOk && fechasOk && habitacion.disponible;
        });

    console.log("Habitaciones filtradas:", habitacionesFiltradas); // Depuración
    // Agrupar por tipo y tomar la primera habitación de cada tipo
    const habitacionesPorTipo = {};
    habitacionesFiltradas.forEach((habitacion) => {
      if (!habitacionesPorTipo[habitacion.tipo]) {
        habitacionesPorTipo[habitacion.tipo] = habitacion;
      }
    });
    const habitacionesUnicasPorTipo = Object.values(habitacionesPorTipo);
    window.dibujarHabitacionesFiltradas(habitacionesUnicasPorTipo);
    window.bloquearFechas(habitacionesFiltradas, llegada, salida); // Usar habitaciones filtradas
  } catch (error) {
    console.error("Error al filtrar habitaciones:", error);
    alert("Hubo un problema al buscar habitaciones.");
  }
};

window.dibujarHabitacionesFiltradas = (habitaciones) => {
  console.log("Iniciando dibujarHabitacionesFiltradas"); // Depuración adicional
  contHabitaciones.innerHTML = "";
  if (habitaciones.length === 0) {
    contHabitaciones.innerHTML = `<p class="text-center text-gray-600">No hay habitaciones disponibles para los criterios seleccionados.</p>`;
    return;
  }
  const usuarioEmail = sessionStorage.getItem("email");
  habitaciones.forEach((habitacion) => {
    const btnClass = usuarioEmail ? "permitir-reservar" : "reservar";
    contHabitaciones.innerHTML += `
      <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
        <img src="${habitacion.img}" alt="${
      habitacion.tipo
    }" class="w-full h-48 object-cover img-habitacion" />
        <div class="p-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">${
            habitacion.tipo
          }</h3>
          <p class="text-gray-600 text-sm mb-4">${
            habitacion.descripcion || "Sin descripción"
          }</p>
          <ul class="text-sm text-gray-500">
            <li>✔ Wi-Fi</li>
            <li>✔ TV</li>
            <li>✔ Baño privado</li>
          </ul>
          <h3 class="text-xl font-bold text-green-800 mb-2 my-2">${
            habitacion.precio
          }</h3>
        </div>
        <div class="p-3 flex justify-center">
          <button class="${btnClass} bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${
      habitacion.id
    }">
            Reservar
          </button>
        </div>
      </div>`;
  });
  if (typeof window.mostrarFormReserva === "function") {
    window.mostrarFormReserva(document.getElementById("modalReserva"));
  }
};

window.bloquearFechas = (habitaciones, llegada, salida) => {
  console.log("Iniciando bloquearFechas"); // Depuración adicional
  const startDate = document.getElementById("llegada");
  const endDate = document.getElementById("salida");
  const disabledDates = new Set();

  const fechaLlegada = new Date(llegada);
  const fechaSalida = new Date(salida);

  console.log("Habitaciones para bloquear fechas:", habitaciones); // Depuración
  console.log("Rango seleccionado:", { llegada, salida }); // Depuración

  // Solo agregar fechas ocupadas de habitaciones no disponibles que interfieran con el rango
  habitaciones.forEach((habitacion) => {
    if (!habitacion.disponible) {
      console.log(
        `Habitación no disponible (ID: ${habitacion.id}, Tipo: ${habitacion.tipo}):`,
        habitacion.fechas_ocupadas
      );
      (habitacion.fechas_ocupadas || []).forEach((f) => {
        const fechaInicio = new Date(f.fecha_entrada);
        const fechaFin = new Date(f.fecha_salida);
        if (
          (fechaLlegada >= fechaInicio && fechaLlegada <= fechaFin) ||
          (fechaSalida >= fechaInicio && fechaSalida <= fechaFin) ||
          (fechaLlegada <= fechaInicio && fechaSalida >= fechaFin)
        ) {
          for (
            let d = new Date(fechaInicio);
            d <= fechaFin;
            d.setDate(d.getDate() + 1)
          ) {
            disabledDates.add(d.toISOString().split("T")[0]);
          }
        }
      });
    }
  });

  console.log("Fechas bloqueadas:", Array.from(disabledDates)); // Depuración

  [startDate, endDate].forEach((input) => {
    input.min = new Date().toISOString().split("T")[0];
    input.addEventListener("input", () => {
      const value = input.value;
      if (disabledDates.has(value)) {
        console.log(`Fecha bloqueada detectada: ${value}`); // Depuración
        alert("Fecha ocupada. Selecciona otra.");
        input.value = "";
      }
    });
  });
};

// Evento para el formulario de reserva
document.addEventListener("DOMContentLoaded", () => {
  const formReserva = document.getElementById("formuReserva");
  if (formReserva) {
    formReserva.addEventListener("submit", (e) => {
      e.preventDefault();
      window.filtrarHabitaciones();
    });
  }
});
