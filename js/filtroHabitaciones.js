import { mostrarFormReserva } from "./reservas.js";

// Elementos
const contHabitaciones = document.getElementById("cont-habitaciones");
const API = "https://servidor-j7p3.onrender.com";

// Función para filtrar habitaciones
export async function filtrarHabitaciones() {
  console.log("Iniciando filtrarHabitaciones");
  const cantPersonasInput = document.getElementById("cantPersonas");
  const llegadaInput = document.getElementById("llegada");
  const salidaInput = document.getElementById("salida");

  const cantPersonas = cantPersonasInput
    ? parseInt(cantPersonasInput.value)
    : NaN;
  const llegada = llegadaInput ? llegadaInput.value : "";
  const salida = salidaInput ? salidaInput.value : "";

  console.log("Datos de entrada:", { cantPersonas, llegada, salida });

  // Validacion del formulario
  if (
    !cantPersonas ||
    isNaN(cantPersonas) ||
    cantPersonas <= 0 ||
    !llegada ||
    !salida ||
    new Date(llegada) > new Date(salida)
  ) {
    alert(
      "Ingresa un numero valido de personas (> 0) y fechas correctas (llegada no posterior a salida)."
    );
    return;
  }

  try {
    const response = await fetch(`${API}/habitaciones`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud a la API: ${response.status}`);
    }
    const data = await response.json();
    const habitaciones = data;

    const habitacionesFiltradas = [];
    for (let i = 0; i < habitaciones.length; i++) {
      const habitacion = habitaciones[i];
      let capacidadOk = habitacion.capacidad >= cantPersonas;
      let fechasOk = true;

      if (habitacion.fechas_ocupadas && habitacion.fechas_ocupadas.length > 0) {
        for (let j = 0; j < habitacion.fechas_ocupadas.length; j++) {
          const fechaInicio = new Date(
            habitacion.fechas_ocupadas[j].fecha_entrada
          );
          const fechaFin = new Date(habitacion.fechas_ocupadas[j].fecha_salida);
          const fechaLlegada = new Date(llegada);
          const fechaSalida = new Date(salida);

          if (
            (fechaLlegada >= fechaInicio && fechaLlegada <= fechaFin) ||
            (fechaSalida >= fechaInicio && fechaSalida <= fechaFin) ||
            (fechaLlegada <= fechaInicio && fechaSalida >= fechaFin)
          ) {
            fechasOk = false;
            break;
          }
        }
      }

      if (capacidadOk && fechasOk && habitacion.disponible) {
        habitacionesFiltradas.push(habitacion);
      }
    }

    const habitacionesPorTipo = {};
    for (let i = 0; i < habitacionesFiltradas.length; i++) {
      const habitacion = habitacionesFiltradas[i];
      if (!habitacionesPorTipo[habitacion.tipo]) {
        habitacionesPorTipo[habitacion.tipo] = habitacion;
      }
    }
    const habitacionesUnicasPorTipo = Object.values(habitacionesPorTipo);
    console.log("Habitaciones únicas por tipo:", habitacionesUnicasPorTipo);

    dibujarHabitacionesFiltradas(habitacionesUnicasPorTipo);
    bloquearFechas(habitacionesFiltradas, llegada, salida);
  } catch (error) {
    console.error("Error al filtrar habitaciones:", error);
    alert("Hubo un problema al buscar habitaciones.");
  }
}

// Funcion para dibujar habitaciones filtradas
function dibujarHabitacionesFiltradas(habitaciones) {
  contHabitaciones.innerHTML = "";
  if (habitaciones.length === 0) {
    contHabitaciones.innerHTML = `<p class="text-center text-gray-600">No hay habitaciones disponibles para los criterios seleccionados.</p>`;
    return;
  }
  const usuarioEmail = sessionStorage.getItem("email");
  for (let i = 0; i < habitaciones.length; i++) {
    const habitacion = habitaciones[i];
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
  }
  if (typeof mostrarFormReserva === "function") {
    mostrarFormReserva(document.getElementById("modalReserva"));
  }
}

// Función para bloquear fechas
function bloquearFechas(habitaciones, llegada, salida) {
  console.log("Iniciando bloquearFechas");
  const startDate = document.getElementById("llegada");
  const endDate = document.getElementById("salida");
  const disabledDates = new Set();

  const fechaLlegada = new Date(llegada);
  const fechaSalida = new Date(salida);

  console.log("Habitaciones para bloquear fechas:", habitaciones);
  console.log("Rango seleccionado:", { llegada, salida });

  for (let i = 0; i < habitaciones.length; i++) {
    const habitacion = habitaciones[i];
    if (!habitacion.disponible) {
      console.log(
        `Habitación no disponible (ID: ${habitacion.id}, Tipo: ${habitacion.tipo}):`,
        habitacion.fechas_ocupadas
      );
      const fechasOcupadas = habitacion.fechas_ocupadas || [];
      for (let j = 0; j < fechasOcupadas.length; j++) {
        const fechaInicio = new Date(fechasOcupadas[j].fecha_entrada);
        const fechaFin = new Date(fechasOcupadas[j].fecha_salida);
        console.log(`Procesando fechas ocupadas:`, { fechaInicio, fechaFin });
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
      }
    }
  }

  console.log("Fechas bloqueadas:", Array.from(disabledDates));

  const inputs = [startDate, endDate];
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    if (input) {
      input.min = new Date().toISOString().split("T")[0];
      input.addEventListener("input", () => {
        const value = input.value;
        if (disabledDates.has(value)) {
          console.log(`Fecha bloqueada detectada: ${value}`);
          alert("Fecha ocupada. Selecciona otra.");
          input.value = "";
        }
      });
    }
  }
}

// Evento para el formulario de reserva
document.addEventListener("DOMContentLoaded", () => {
  const formReserva = document.getElementById("formuReserva");
  if (formReserva) {
    formReserva.addEventListener("submit", (e) => {
      e.preventDefault();
      filtrarHabitaciones();
    });
  }
});
