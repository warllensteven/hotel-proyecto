import { API, cerrarModal } from "./auth.js";

// Declaración de variables DOM al inicio
const contHabitaciones = document.getElementById("cont-habitaciones");
const contServicios = document.getElementById("cont-servicios");
const modalReserva = document.getElementById("modalReserva");
const botonAbrirMenu = document.getElementById("abrir-menu");
const botonCerrarMenu = document.getElementById("cerrar-menu");
const menuMobile = document.getElementById("menu-movil");
const backdrop = document.getElementById("backdrop");
const carrusel = document.getElementById("carrusel");
const derecha = document.getElementById("derecha");
const izquierda = document.getElementById("izquierda");

document.addEventListener("DOMContentLoaded", function () {
  console.log("Página cargada, inicializando eventos...");

  // Menú móvil
  botonAbrirMenu?.addEventListener("click", () => {
    console.log("Abriendo menú móvil");
    menuMobile?.classList.remove("hidden");
  });

  botonCerrarMenu?.addEventListener("click", () => {
    console.log("Cerrando menú móvil");
    menuMobile?.classList.add("hidden");
  });

  backdrop?.addEventListener("click", () => {
    console.log("Cerrando menú móvil por backdrop");
    menuMobile?.classList.add("hidden");
  });

  // Carrusel de imágenes
  let contCarrusel = 0;
  const imgsCarrusel = [
    "carrusel-1.png",
    "carrusel-2.png",
    "carrusel-3.png",
    "carrusel-4.png",
    "carrusel-5.png",
  ];
  const imgsCarruselMobile = [
    "carrusel-mv-1.png",
    "carrusel-mv-2.png",
    "carrusel-mv-3.png",
    "carrusel-mv-4.png",
    "carrusel-mv-5.png",
  ];
  let currentImgsCarrusel =
    window.innerWidth <= 768 ? imgsCarruselMobile : imgsCarrusel;

  window.addEventListener("resize", () => {
    currentImgsCarrusel =
      window.innerWidth <= 768 ? imgsCarruselMobile : imgsCarrusel;
    contCarrusel = 0;
    actualizarCarrusel();
  });

  function actualizarCarrusel() {
    const im = document.createElement("img");
    im.setAttribute("src", `./imgs/${currentImgsCarrusel[contCarrusel]}`);
    im.setAttribute("id", "im-carrusel");
    im.setAttribute("alt", "Imagen carrusel hotel");
    const imm = document.getElementById("im-carrusel");
    carrusel?.replaceChild(im, imm);
  }

  derecha?.addEventListener("click", () => {
    console.log("Clic en flecha derecha del carrusel");
    contCarrusel = (contCarrusel + 1) % currentImgsCarrusel.length;
    actualizarCarrusel();
  });

  izquierda?.addEventListener("click", () => {
    console.log("Clic en flecha izquierda del carrusel");
    contCarrusel =
      (contCarrusel - 1 + currentImgsCarrusel.length) %
      currentImgsCarrusel.length;
    actualizarCarrusel();
  });

  // Funciones de reserva
  const mostrarFormReserva = () => {
    if (!contHabitaciones) {
      console.error("Contenedor cont-habitaciones no encontrado");
      return;
    }
    contHabitaciones.addEventListener("click", (e) => {
      const button = e.target.closest(".reservar, .permitir-reservar");
      if (!button) return;

      e.preventDefault();
      const habitacionId = parseInt(button.id.replace("reservar-", ""));
      if (isNaN(habitacionId)) {
        console.error("ID de habitación inválido:", button.id);
        return;
      }

      if (sessionStorage.getItem("email")) {
        console.log(
          "Usuario autenticado, abriendo modal de reserva para ID:",
          habitacionId
        );
        dibujarFormReservas(habitacionId, modalReserva);
        modalReserva?.classList.remove("hidden");
      } else {
        console.log("Usuario no autenticado, abriendo modal de inicio");
        const modalInicio = document.getElementById("modalInicio");
        modalInicio?.classList.remove("hidden");
      }
    });

    // Cerrar modal de reserva
    window.addEventListener("click", (e) => {
      if (e.target.id === "modalReserva" || e.target.id === "closeModal") {
        cerrarModal(modalReserva);
      }
    });
  };

  const dibujarFormReservas = (habitacionId, form) => {
    fetch(`${API}/habitaciones`)
      .then((response) => response.json())
      .then((data) => {
        const habitaciones = data.habitaciones || data; // Manejar si la API devuelve el array directamente
        console.log("Datos de habitaciones:", habitaciones);
        const habitacion = Array.isArray(habitaciones)
          ? habitaciones.find((h) => h.id === habitacionId)
          : (habitaciones.habitaciones || []).find(
              (h) => h.id === habitacionId
            );
        if (habitacion) {
          form.innerHTML = `
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
          formReserva.addEventListener("submit", manejarConfirmacionReserva);
          // No llamamos a filtrarHabitaciones aquí, solo al submit
        } else {
          console.error("Habitación no encontrada con ID:", habitacionId);
          form.innerHTML = `<p class="text-red-500">Habitación no disponible.</p>`;
        }
      })
      .catch((error) => console.error("Error cargando habitaciones:", error));
  };

  const manejarConfirmacionReserva = async (e) => {
    e.preventDefault();
    console.log("Intentando confirmar reserva...");
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

    console.log("Datos de reserva:", {
      usuarioCorreo,
      tipoHabitacion,
      cantPersonas,
      fechaEntrada,
      fechaSalida,
    });
    if (
      !usuarioCorreo ||
      !cantPersonas ||
      isNaN(cantPersonas) ||
      !fechaEntrada ||
      !fechaSalida
    ) {
      console.log("Faltan datos requeridos o inválidos");
      return;
    }

    // Usar filtrarHabitaciones para validar disponibilidad
    if (typeof window.filtrarHabitaciones === "function") {
      console.log("Validando disponibilidad con filtrarHabitaciones");
      await window.filtrarHabitaciones(); // Esto actualiza las fechas bloqueadas y filtra
      // Verificamos si hay habitaciones disponibles después del filtrado
      const habitacionesFiltradas = window.dibujarHabitacionesFiltradas; // No es una función, es el resultado implícito
      if (!habitacionesFiltradas || habitacionesFiltradas.length === 0) {
        console.log(
          "No hay habitaciones disponibles para las fechas seleccionadas"
        );
        alert("No hay habitaciones disponibles para las fechas seleccionadas.");
        return;
      }
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
      const habitaciones = habitacionesData.habitaciones || habitacionesData;
      console.log("Habitaciones recibidas:", habitaciones);

      if (!Array.isArray(habitaciones)) {
        console.error("Formato de habitaciones inválido:", habitaciones);
        return;
      }

      const habitacionDisponible = habitaciones.find(
        (h) =>
          h.tipo.trim().toLowerCase() === tipoHabitacion &&
          h.disponible &&
          h.capacidad >= cantPersonas
      );
      if (!habitacionDisponible) {
        console.log(
          "No hay habitaciones disponibles de tipo:",
          tipoHabitacion,
          "para",
          cantPersonas,
          "personas"
        );
        return;
      }

      const usuario = usuarios.find((u) => u.correo === usuarioCorreo);
      if (!usuario) {
        console.log("Usuario no encontrado");
        return;
      }

      const fechasOcupadas = (habitacionDisponible.fechas_ocupadas || []).some(
        (f) =>
          (fechaEntrada >= f.fecha_entrada && fechaEntrada <= f.fecha_salida) ||
          (fechaSalida >= f.fecha_entrada && fechaSalida <= f.fecha_salida) ||
          (fechaEntrada <= f.fecha_entrada && fechaSalida >= f.fecha_salida)
      );

      if (fechasOcupadas) {
        console.log(
          "La habitación no está disponible en las fechas solicitadas."
        );
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

      console.log(
        `Reserva confirmada para ${usuarioCorreo} en la habitación ${habitacionDisponible.id} desde ${fechaEntrada} hasta ${fechaSalida}`
      );
      alert("¡Reserva confirmada!");
      cerrarModal(modalReserva);
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert("Ocurrió un error al realizar la reserva. Inténtalo más tarde.");
    }
  };

  // Dibujar habitaciones
  const dibujarHabitaciones = (elemHtml) => {
    elemHtml.innerHTML = "";
    fetch(`${API}/habitaciones`)
      .then((response) => response.json())
      .then((data) => {
        const habitaciones = data.habitaciones || data;
        console.log("Habitaciones cargadas:", habitaciones);
        const tiposUnicos = [...new Set(habitaciones.map((h) => h.tipo))];
        tiposUnicos.forEach((tipo, index) => {
          const habitacionEjemplo = habitaciones.find(
            (h) =>
              h.tipo === tipo &&
              h.id ===
                Math.min(
                  ...habitaciones
                    .filter((h) => h.tipo === tipo)
                    .map((h) => h.id)
                )
          );
          const botonClass = sessionStorage.getItem("email")
            ? "permitir-reservar"
            : "reservar";
          elemHtml.innerHTML += `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <img src="${habitacionEjemplo.img}" alt="${tipo}" class="w-full h-48 object-cover img-habitacion" />
              <div class="p-4">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${tipo}</h3>
                <p class="text-gray-600 text-sm mb-4">${habitacionEjemplo.descripcion}</p>
                <ul class="text-sm text-gray-500">
                  <li>✔ Wi-Fi</li>
                  <li>✔ TV</li>
                  <li>✔ Baño privado</li>
                </ul>
                <h3 class="text-xl font-bold text-green-800 mb-2 my-2">${habitacionEjemplo.precio}</h3>
              </div>
              <div class="p-3 flex justify-center">
                <button class="${botonClass} bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${habitacionEjemplo.id}">
                  Reservar
                </button>
              </div>
            </div>`;
        });
        mostrarFormReserva(); // Inicializar eventos después de dibujar las habitaciones
      })
      .catch((error) => {
        console.error("Error cargando habitaciones:", error);
        elemHtml.innerHTML = `<p class="text-red-500">Error al cargar habitaciones.</p>`;
      });
  };

  // Dibujar servicios
  const dibujarServicios = async (elemHtml) => {
    elemHtml.innerHTML = "";
    try {
      const response = await fetch(`${API}/servicios`);
      const servicios = await response.json();
      servicios.forEach((servicio) => {
        elemHtml.innerHTML += `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
            <img src="${servicio.img}" alt="${servicio.descripcion}" class="w-full h-48 object-cover img-servicio" />
            <div class="p-4">
              <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">${servicio.descripcion}</h3>
            </div>
          </div>`;
      });
    } catch (error) {
      elemHtml.innerHTML = `<p class="text-red-500">Error al cargar servicios.</p>`;
      console.error("Error cargando servicios:", error);
    }
  };

  // Ejecutar funciones al cargar
  console.log("Cargando habitaciones y servicios");
  dibujarHabitaciones(contHabitaciones);
  dibujarServicios(contServicios);
});
