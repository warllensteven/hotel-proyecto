// API
const API = "https://servidor-j7p3.onrender.com";

// menu
document.addEventListener("DOMContentLoaded", function () {
  const botonAbrirMenu = document.getElementById("abrir-menu");
  const botonCerrarMenu = document.getElementById("cerrar-menu");
  const menuMobile = document.getElementById("menu-movil");
  const backdrop = document.getElementById("backdrop");

  botonAbrirMenu.addEventListener("click", () =>
    menuMobile.classList.remove("hidden")
  );
  botonCerrarMenu.addEventListener("click", () =>
    menuMobile.classList.add("hidden")
  );
  backdrop.addEventListener("click", () => menuMobile.classList.add("hidden"));
});

// dibujar habitaciones
const dibujarHabitaciones = (elemHtml) => {
  elemHtml.innerHTML = "";
  fetch(`${API}/habitaciones`)
    .then((response) => response.json())
    .then((habitaciones) => {
      habitaciones.forEach((habitacion, index) => {
        const usuarioActivo = sessionStorage.getItem("email");
        const btnClass = usuarioActivo ? "permitir-reservar" : "reservar";

        elemHtml.innerHTML += `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
            <img src="${habitacion.img}" alt="${habitacion.descripcion}" class="w-full h-48 object-cover img-habitacion" />
            <div class="p-4">
              <h3 class="text-xl font-bold text-gray-800 mb-2">${habitacion.titulo}</h3>
              <p class="text-gray-600 text-sm mb-4">${habitacion.descripcion}</p>
              <ul class="text-sm text-gray-500">
                <li>✔ Wi-Fi</li>
                <li>✔ TV</li>
                <li>✔ Baño privado</li>
              </ul>
              <h3 class="text-xl font-bold text-green-800 mb-2 my-2">${habitacion.precio}</h3>
            </div>
            <div class="p-3 flex justify-center">
              <button class="${btnClass} bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${index}">
                Reservar
              </button>
            </div>
          </div>`;
      });
    });
};

const contHabitaciones = document.getElementById("cont-habitaciones");
dibujarHabitaciones(contHabitaciones);

// Modal de inicio de sesión
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("reservar")) {
    modal.style.display = "block";
  }
});

span.onclick = () => (modal.style.display = "none");

// Modal de registro
const modalRegistro = document.getElementById("modalRegistro");
const spanRegistro = document.getElementsByClassName("close-registro")[0];

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("abrir-Registro")) {
    modalRegistro.style.display = "block";
  }
});

spanRegistro.onclick = () => (modalRegistro.style.display = "none");

window.onclick = function (event) {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === modalRegistro) modalRegistro.style.display = "none";
};

// Registro de usuarios
const formuRegistro = document.getElementById("formuRegistro");

formuRegistro.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pAviso = document.getElementById("aviso");
  const emailRegistro = document.getElementById("emailRegistro").value.trim();
  const contraRegistro = document
    .getElementById("contraseñaRegistro")
    .value.trim();

  if (emailRegistro && contraRegistro) {
    sessionStorage.setItem("email", emailRegistro);
    sessionStorage.setItem("contraseña", contraRegistro);

    const usuario = {
      correo: emailRegistro,
      contraseña: contraRegistro,
      reservas: [],
    };

    try {
      const response = await fetch(`${API}/usuarios`);
      const data = await response.json();

      const existe = data.find((u) => u.correo === emailRegistro);
      if (existe) {
        pAviso.innerHTML = `<p>El usuario ${emailRegistro} ya está registrado</p>`;
      } else {
        await fetch(`${API}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        });
      }
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  }
});

// Inicio de sesion
const formuInicio = document.getElementById("formuInicio");
const esqRegistro = document.getElementById("esquina-registrar");
const esqInicio = document.getElementById("esquina-sesion");

formuInicio.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const contra = document.getElementById("contraseña").value.trim();

  if (email && contra) {
    try {
      const response = await fetch(`${API}/usuarios`);
      const data = await response.json();

      const usuario = data.find(
        (u) => u.correo === email && u.contraseña === contra
      );
      if (usuario) {
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        esqInicio.style.display = "none";
        esqRegistro.style.display = "none";
        location.reload();
      } else {
        alert("Contraseña incorrecta o usuario no registrado");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  }
});

// Mostrar el formulario de reserva solo si el usuario está logueado
const modalReserva = document.getElementById("modalReserva");

document.addEventListener("DOMContentLoaded", () => {
  const usuarioEmail = sessionStorage.getItem("email");
  if (usuarioEmail) {
    esqInicio?.classList.add("hidden");
    esqRegistro?.classList.add("hidden");
    mostrarFormReserva(modalReserva);
  }
});

let eventoAgregado = false;

const mostrarFormReserva = (modalReserva) => {
  if (!eventoAgregado) {
    window.addEventListener("click", (e) => {
      let comparador = parseInt(e.target.id.slice(-1));

      if (!isNaN(comparador) && comparador >= 0) {
        dibujarFormReservas(comparador, modalReserva);
        modalReserva.classList.toggle("hidden");
      } else if (e.target.id === "modalReserva") {
        modalReserva.classList.toggle("hidden");
      }
    });
    eventoAgregado = true;
  }
};

// Función para renderizar el formulario de reservas desde la API local
const dibujarFormReservas = (comparador, form) => {
  fetch(`${API}/habitaciones/${comparador + 1}`)
    .then((res) => res.json())
    .then((habitacion) => {
      form.innerHTML = `
        <div class="bg-white rounded-lg max-w-lg w-full p-6 relative">
          <span id="closeModal" class="absolute top-2 right-2 text-xl font-bold text-gray-500 cursor-pointer">&times;</span>
          <h2 class="text-2xl font-semibold text-gray-800 mb-4" id="titulo-buscar">${habitacion.titulo}</h2>
          <p class="text-gray-600 mb-3">${habitacion.descripcion}</p>
          <p class="text-orange-500 text-sm mb-2">WiFi: Sí</p>
          <p class="text-orange-500 text-sm mb-2">Máx. Personas: ${habitacion.capacidad}</p>
          <p class="text-orange-500 text-sm mb-2">Disponible: Sí</p>
          <p class="text-green-500 text-lg font-semibold mb-4">${habitacion.precio} por noche</p>
          <p class="text-gray-600 mb-3">Check in entrada: 5:00 pm</p>
          <p class="text-gray-600 mb-3">Check in salida: 2:00 pm</p>

          <form id="formReserva" class="space-y-4">
            <div>
              <label for="fechaComienzoReserva" class="block text-gray-700">Fecha de inicio:</label>
              <input type="date" id="fechaComienzoReserva" class="w-full border border-gray-300 p-2 rounded-md" required>
            </div>
            <div>
              <label for="fechaFinalReserva" class="block text-gray-700">Fecha de finalización:</label>
              <input type="date" id="fechaFinalReserva" class="w-full border border-gray-300 p-2 rounded-md" required>
            </div>
            <button type="submit" class="confirmar-reserva w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              Confirmar Reserva
            </button>
          </form>
        </div>`;

      document.getElementById("closeModal").addEventListener("click", () => {
        form.classList.add("hidden");
      });
    })
    .catch((error) => console.error("Error cargando habitación:", error));
};

// Confirmar reserva usando la API local
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("confirmar-reserva")) {
    e.preventDefault();

    try {
      const email = sessionStorage.getItem("email");
      const titulo = document.getElementById("titulo-buscar")?.textContent;
      const fechaEntrada = document.getElementById(
        "fechaComienzoReserva"
      ).value;
      const fechaSalida = document.getElementById("fechaFinalReserva").value;

      const [usuarios, habitaciones] = await Promise.all([
        fetch(`${API}/usuarios`).then((r) => r.json()),
        fetch(`${API}/habitaciones`).then((r) => r.json()),
      ]);

      const usuario = usuarios.find((u) => u.correo === email);
      const habitacion = habitaciones.find((h) => h.titulo === titulo);

      if (!usuario || !habitacion) return;

      const fechaOcupada = habitacion.fechas?.some(
        (f) =>
          (fechaEntrada >= f.fecha_entrada && fechaEntrada <= f.fecha_salida) ||
          (fechaSalida >= f.fecha_entrada && fechaSalida <= f.fecha_salida)
      );

      if (fechaOcupada) {
        alert("La habitación no está disponible en las fechas seleccionadas.");
        return;
      }

      usuario.reservas.push({
        habitacion_id: habitacion.id,
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
      });

      habitacion.fechas.push({
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
      });

      await Promise.all([
        fetch(`${API}/usuarios/${usuario.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        }),
        fetch(`${API}/habitaciones/${habitacion.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(habitacion),
        }),
      ]);

      alert("Reserva confirmada con éxito.");
      modalReserva.classList.add("hidden");
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
    }
  }
});

// Filtro de habitaciones disponibles
const formuReserva = document.getElementById("formuReserva");

formuReserva.addEventListener("submit", async (event) => {
  event.preventDefault();
  contHabitaciones.style.display = "none";

  const cantPersonas = parseInt(
    document.getElementById("cantPersonas").value,
    10
  );
  const llegada = new Date(document.getElementById("llegada").value);
  const salida = new Date(document.getElementById("salida").value);

  if (
    cantPersonas <= 0 ||
    isNaN(llegada) ||
    isNaN(salida) ||
    llegada >= salida
  ) {
    alert("Por favor, revisa los datos ingresados.");
    formuReserva.reset();
    return;
  }

  try {
    const response = await fetch(`${API}/habitaciones`);
    const habitaciones = await response.json();

    const habitacionesFiltradas = habitaciones.filter((habitacion) => {
      const capacidadOk = habitacion.personas.includes(cantPersonas);
      const fechasOk = habitacion.fechas.every((res) => {
        const entradaReserva = new Date(res.fecha_entrada);
        const salidaReserva = new Date(res.fecha_salida);
        return !(llegada < salidaReserva && salida > entradaReserva);
      });

      return capacidadOk && fechasOk;
    });

    mostrarHabitaciones(habitacionesFiltradas);
  } catch (error) {
    console.error("Error al filtrar habitaciones:", error);
    alert("Hubo un problema al buscar habitaciones.");
  }

  formuReserva.reset();
});

// Función para mostrar habitaciones en el DOM
function mostrarHabitaciones(habitaciones) {
  const contenedor = document.createElement("div");
  contenedor.className =
    "mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-6";

  if (habitaciones.length === 0) {
    contenedor.innerHTML = `<p>No hay habitaciones disponibles para los criterios seleccionados.</p>`;
  } else {
    habitaciones.forEach((habitacion, index) => {
      const habitacionDiv = document.createElement("div");
      habitacionDiv.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
          <img src="${habitacion.img}" alt="${habitacion.descripcion}" class="w-full h-48 object-cover img-habitacion" />
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-800 mb-2">${habitacion.titulo}</h3>
            <p class="text-gray-600 text-sm mb-4">${habitacion.descripcion}</p>
            <ul class="text-sm text-gray-500">
              <li>✔ Wi-Fi</li>
              <li>✔ TV</li>
              <li>✔ Baño privado</li>
            </ul>
            <h3 class="text-xl font-bold text-green-800 mb-2 my-2">${habitacion.precio}</h3>
          </div>
          <div class="p-3 flex justify-center">
            <button class="reservar bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${index}">
              Reservar
            </button>
          </div>
        </div>`;
      contenedor.appendChild(habitacionDiv);
    });
  }

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  resultado.appendChild(contenedor);
}

// Bloquear fechas reservadas (si lo necesitas en el futuro)
function bloquearFechasReservadas(habitaciones) {
  habitaciones.forEach((habitacion) => {
    if (!habitacion.reservas) return;
    habitacion.reservas.forEach((reserva) => {
      let option = document.createElement("option");
      option.value = reserva.llegada;
      option.text = `No disponible: ${new Date(
        reserva.llegada
      ).toLocaleDateString()} - ${new Date(
        reserva.salida
      ).toLocaleDateString()}`;
      option.disabled = true;
      document.getElementById("fechaComienzoReserva")?.appendChild(option);
      document
        .getElementById("fechaFinalReserva")
        ?.appendChild(option.cloneNode(true));
    });
  });
}

// Mostrar reservas del usuario actual
const reservas = document.getElementById("tusreservas");

const mostrarReservas = async (contenedor) => {
  contenedor.innerHTML = "";

  const email = sessionStorage.getItem("email");
  if (!email) return;

  try {
    const response = await fetch(`${API}/usuarios?correo=${email}`);
    if (!response.ok) throw new Error("No se pudo obtener el usuario");

    const usuarios = await response.json();
    const usuario = usuarios[0];

    if (!usuario || !usuario.reservas || usuario.reservas.length === 0) {
      contenedor.innerHTML = "<p>No tienes reservas registradas.</p>";
      return;
    }

    usuario.reservas.forEach((res) => {
      contenedor.innerHTML += `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Reserva</h3>
            <p class="text-gray-600 text-sm mb-2">Habitación ID: ${res.habitacion_id}</p>
            <p class="text-gray-600 text-sm mb-2">Entrada: ${res.fecha_entrada}</p>
            <p class="text-gray-600 text-sm mb-2">Salida: ${res.fecha_salida}</p>
          </div>
        </div>`;
    });
  } catch (error) {
    console.error("Error mostrando las reservas:", error);
    contenedor.innerHTML =
      "<p>Error al cargar tus reservas. Intenta más tarde.</p>";
  }
};

mostrarReservas(reservas);
