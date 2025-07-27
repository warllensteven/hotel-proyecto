import { API, cerrarModal } from "./auth.js";
import { filtrarHabitaciones } from "./filtroHabitaciones.js";

// Funcion que muestra el formulario de reserva
export function mostrarFormReserva(modal) {
  document.querySelectorAll(".permitir-reservar, .reservar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const habitacionId = parseInt(btn.id.replace("reservar-", ""));
      if (isNaN(habitacionId)) {
        console.error("ID de habitación invalido:", btn.id);
        return;
      }

      const usuarioCorreo = sessionStorage.getItem("email");
      if (!usuarioCorreo) {
        alert("Debes iniciar sesion para reservar.");
        return;
      }
      dibujarFormReservas(habitacionId, modal);
      modal.classList.remove("hidden");
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.id === "modalReserva" || e.target.id === "closeModal") {
      cerrarModal(modal);
    }
  });
}

const dibujarFormReservas = (habitacionId, modal) => {
  fetch(`${API}/habitaciones`)
    .then((response) => response.json())
    .then((data) => {
      const habitaciones = data;
      const habitacion = habitaciones.find((h) => h.id === habitacionId);
      if (habitacion) {
        modal.innerHTML = `
          <div class="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <span id="closeModal" class="absolute top-2 right-2 text-xl font-bold text-gray-500 cursor-pointer">×</span>
            <h2 class="text-2xl font-semibold text-gray-800 mb-4" id="tipo-buscar">${habitacion.tipo}</h2>
            <p class="text-gray-600 mb-3">${habitacion.descripcion}</p>
            <p class="text-orange-500 text-sm mb-2">Máx. Personas: ${habitacion.capacidad}</p>
            <p class="text-green-500 text-lg font-semibold mb-4">${habitacion.precio} por noche</p>
            <p class="text-gray-600 mb-3">Check in entrada: 5:00 pm</p>
            <p class="text-gray-600 mb-3">Check in salida: 2:00 pm</p>
            <form id="formReserva" class="space-y-4">
              <div>
                <label for="cantPersonas" class="block text-gray-700">Número de personas:</label>
                <input type="number" id="cantPersonas" class="w-full border border-gray-300 p-2 rounded-md" required min="1">
              </div>
              <div>
                <label for="llegada" class="block text-gray-700">Fecha de inicio:</label>
                <input type="date" id="llegada" class="w-full border border-gray-300 p-2 rounded-md" required>
              </div>
              <div>
                <label for="salida" class="block text-gray-700">Fecha de finalización:</label>
                <input type="date" id="salida" class="w-full border border-gray-300 p-2 rounded-md" required>
              </div>
              <button type="submit" class="confirmar-reserva w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                Confirmar Reserva
              </button>
            </form>
          </div>`;

        const formReserva = document.getElementById("formReserva");
        formReserva.addEventListener("submit", (e) =>
          manejarConfirmacionReserva(e, modal)
        );
      } else {
        modal.innerHTML = `<p class="text-red-500">Habitación no disponible.</p>`;
      }
    })
    .catch((error) => console.error("Error cargando habitaciones:", error));
};

// funcion de gestion del formulario de reserva
const manejarConfirmacionReserva = async (e, modal) => {
  e.preventDefault();
  const tipoHabitacion = document
    .getElementById("tipo-buscar")
    .textContent.trim()
    .toLowerCase();
  const cantPersonas = parseInt(
    document.getElementById("cantPersonas").value,
    10
  );
  const fechaEntrada = document.getElementById("llegada").value;
  const fechaSalida = document.getElementById("salida").value;
  const usuarioCorreo = sessionStorage.getItem("email");

  if (
    !usuarioCorreo ||
    !cantPersonas ||
    isNaN(cantPersonas) ||
    !fechaEntrada ||
    !fechaSalida
  ) {
    console.log("Faltan datos requeridos o son invalidos");
    return;
  }

  if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
    alert("La fecha de entrada debe ser anterior a la de salida.");
    return;
  }

  try {
    const [usuariosResponse, habitacionesResponse] = await Promise.all([
      fetch(`${API}/usuarios`),
      fetch(`${API}/habitaciones`),
    ]);

    if (!usuariosResponse.ok || !habitacionesResponse.ok) {
      throw new Error("Error al obtener los datos del servidor");
    }

    const usuarios = await usuariosResponse.json();
    const habitacionesData = await habitacionesResponse.json();
    const habitaciones = habitacionesData;

    const habitacionDisponible = habitaciones.find(
      (h) =>
        h.tipo.trim().toLowerCase() === tipoHabitacion &&
        h.disponible &&
        h.capacidad >= cantPersonas
    );
    if (!habitacionDisponible) {
      alert(
        "No hay habitaciones disponibles para las fechas o capacidad seleccionadas."
      );
      return;
    }

    const usuario = usuarios.find((u) => u.correo === usuarioCorreo);
    if (!usuario) {
      alert("Usuario no encontrado");
      return;
    }

    const fechasOcupadas = (habitacionDisponible.fechas_ocupadas || []).some(
      (f) =>
        (fechaEntrada >= f.fecha_entrada && fechaEntrada <= f.fecha_salida) ||
        (fechaSalida >= f.fecha_entrada && fechaSalida <= f.fecha_salida) ||
        (fechaEntrada <= f.fecha_entrada && fechaSalida >= f.fecha_salida)
    );

    if (fechasOcupadas) {
      alert("La habitacion no esta disponible en las fechas solicitadas.");
      return;
    }

    if (!usuario.reservas) usuario.reservas = [];
    usuario.reservas.push({
      habitacion_id: habitacionDisponible.id,
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
    });

    habitacionDisponible.disponible = false;
    if (!habitacionDisponible.fechas_ocupadas)
      habitacionDisponible.fechas_ocupadas = [];
    habitacionDisponible.fechas_ocupadas.push({
      fecha_entrada: fechaEntrada,
      fecha_salida: fechaSalida,
    });

    await Promise.all([
      fetch(`${API}/usuarios/${usuario.id}`, {
        method: "PUT",
        body: JSON.stringify(usuario),
        headers: { "Content-Type": "application/json" },
      }),
      fetch(`${API}/habitaciones/${habitacionDisponible.id}`, {
        method: "PUT",
        body: JSON.stringify(habitacionDisponible),
        headers: { "Content-Type": "application/json" },
      }),
    ]);
    alert("¡Reserva confirmada!");
    cerrarModal(modal);
    filtrarHabitaciones();
  } catch (error) {
    alert("Ocurrió un error al realizar la reserva. Inténtalo más tarde.");
  }
};

// funcion de cirre de modal de reserva
document.addEventListener("DOMContentLoaded", () => {
  const closeModal = document.getElementById("closeModal");
  if (closeModal) {
    closeModal.addEventListener("click", () =>
      cerrarModal(document.getElementById("modalReserva"))
    );
  }
});
