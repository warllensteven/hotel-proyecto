const API = "https://servidor-j7p3.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
  const botonAbrirMenu = document.getElementById("abrir-menu");
  const botonCerrarMenu = document.getElementById("cerrar-menu");
  const menuMobile = document.getElementById("menu-movil");
  const backdrop = document.getElementById("backdrop");

  botonAbrirMenu.addEventListener("click", function () {
    menuMobile.classList.remove("hidden");
  });

  botonCerrarMenu.addEventListener("click", function () {
    menuMobile.classList.add("hidden");
  });

  backdrop.addEventListener("click", function () {
    menuMobile.classList.add("hidden");
  });
});

// Carrusel de imagenes
let carrusel = document.getElementById("carrusel");

let imgsCarrusel = [
  "carrusel-1.png",
  "carrusel-2.png",
  "carrusel-3.png",
  "carrusel-4.png",
  "carrusel-5.png",
];

let imgsCarruselMobile = [
  "carrusel-mv-1.png",
  "carrusel-mv-2.png",
  "carrusel-mv-3.png",
  "carrusel-mv-4.png",
  "carrusel-mv-5.png",
];

let currentImgsCarrusel =
  window.innerWidth <= 768 ? imgsCarruselMobile : imgsCarrusel;
const derecha = document.getElementById("derecha");
const izquierda = document.getElementById("izquierda");
let contCarrusel = 0;

window.addEventListener("resize", () => {
  currentImgsCarrusel =
    window.innerWidth <= 768 ? imgsCarruselMobile : imgsCarrusel;
  contCarrusel = 0;
});

derecha.addEventListener("click", () => {
  contCarrusel += 1;
  if (contCarrusel >= currentImgsCarrusel.length) contCarrusel = 0;

  let im = document.createElement("img");
  im.setAttribute("src", `imgs/${currentImgsCarrusel[contCarrusel]}`);
  im.setAttribute("id", "im-carrusel");

  let imm = document.getElementById("im-carrusel");
  carrusel.replaceChild(im, imm);
});

izquierda.addEventListener("click", () => {
  contCarrusel -= 1;
  if (contCarrusel < 0) contCarrusel = currentImgsCarrusel.length - 1;

  let im = document.createElement("img");
  im.setAttribute("src", `imgs/${currentImgsCarrusel[contCarrusel]}`);
  im.setAttribute("id", "im-carrusel");

  let imm = document.getElementById("im-carrusel");
  carrusel.replaceChild(im, imm);
});

// Dibujar habitaciones
let contHabitaciones = document.getElementById("cont-habitaciones");

const dibujarHabitaciones = (elemHtml) => {
  elemHtml.innerHTML = "";
  fetch("https://servidor-j7p3.onrender.com/habitaciones")
    .then((response) => response.json())
    .then((data) =>
      data.forEach((habitacion, index) => {
        const botonClass = sessionStorage.getItem("email")
          ? "permitir-reservar"
          : "reservar";

        elemHtml.innerHTML += `
          <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
            <img
              src="${habitacion.img}"
              alt="${habitacion.descripcion}"
              class="w-full h-48 object-cover img-habitacion"
            />
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
              <button class="${botonClass} bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${index}">
                Reservar
              </button>
            </div>
          </div>`;
      })
    );
};

// Dibujar servicios
let contServicios = document.getElementById("cont-servicios");

const dibujarServicios = async (elemHtml) => {
  elemHtml.innerHTML = "";
  try {
    const response = await fetch(
      "https://servidor-j7p3.onrender.com/servicios"
    );
    const servicios = await response.json();

    servicios.forEach((servicio) => {
      elemHtml.innerHTML += `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
          <img
            src="${servicio.img}"
            alt="${servicio.descripcion}"
            class="w-full h-48 object-cover img-servicio"
          />
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
dibujarHabitaciones(contHabitaciones);
dibujarServicios(contServicios);

// Mostrar modal de inicio si no ha iniciado sesion
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("reservar")) {
    modal.style.display = "block";
  }
});

span.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// registro de usuario

const formuRegistro = document.getElementById("formuRegistro");

formuRegistro.addEventListener("submit", (e) => {
  let pAviso = document.getElementById("aviso");
  e.preventDefault();
  let emailRegistro = document.getElementById("emailRegistro").value.trim();
  let contraRegistro = document
    .getElementById("contraseñaRegistro")
    .value.trim();

  let usuario = {
    correo: emailRegistro,
    contraseña: contraRegistro,
    reservas: [],
  };

  if (emailRegistro && contraRegistro) {
    sessionStorage.setItem("email", emailRegistro);
    sessionStorage.setItem("contraseña", contraRegistro);

    fetch("https://servidor-j7p3.onrender.com/usuarios")
      .then((response) => response.json())
      .then((data) => {
        const yaExiste = data.find((u) => u.correo === emailRegistro);
        if (yaExiste) {
          pAviso.innerHTML = `<p>El usuario ${emailRegistro} ya está registrado</p>`;
        } else {
          fetch("https://servidor-j7p3.onrender.com/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
          })
            .then((res) => res.json())
            .then((data) => console.log("Usuario registrado:", data));
        }
      });
  }
});

// inicio sesion

const formuInicio = document.getElementById("formuInicio");
let esqRegistro = document.getElementById("esquina-registrar");
let esqInicio = document.getElementById("esquina-sesion");

formuInicio.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value.trim();
  let contra = document.getElementById("contraseña").value.trim();

  if (email && contra) {
    fetch("https://servidor-j7p3.onrender.com/usuarios")
      .then((response) => response.json())
      .then((data) => {
        let usuario = data.find(
          (user) => user.correo === email && user.contraseña === contra
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
      });
  }
});

// formulario de reserva si ya inicio sesion
const modalReserva = document.getElementById("modalReserva");

document.addEventListener("DOMContentLoaded", () => {
  const usuarioEmail = sessionStorage.getItem("email");
  if (usuarioEmail) {
    esqInicio.classList.add("hidden");
    esqRegistro.classList.add("hidden");
    mostrarFormReserva(modalReserva);
  }
});

let eventoAgregado = false;

const mostrarFormReserva = (modalReserva) => {
  if (!eventoAgregado) {
    window.addEventListener("click", (e) => {
      let comparador = parseInt(e.target.id.slice(-1));

      if (!isNaN(comparador) && comparador >= 0 && comparador <= 5) {
        dibujarFormReservas(comparador, modalReserva);
        modalReserva.classList.toggle("hidden");
      } else if (e.target.id === "modalReserva") {
        modalReserva.classList.toggle("hidden");
      }
    });

    eventoAgregado = true;
  }
};

// dibujar formulario de reserva

const dibujarFormReservas = (comparador, form) => {
  fetch("https://servidor-j7p3.onrender.com/habitaciones")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((habitacion) => {
        if (comparador + 1 == habitacion.id) {
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

          document
            .getElementById("closeModal")
            .addEventListener("click", () => {
              form.classList.add("hidden");
            });
        }
      });
    })
    .catch((error) => console.error("Error cargando habitaciones:", error));
};

// manejo de la confirmacion de reservas
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("confirmar-reserva")) {
    e.preventDefault();
    try {
      const tituloElement = document.getElementById("titulo-buscar");
      if (!tituloElement) {
        console.error(
          "El elemento con id 'titulo-buscar' no está disponible aún."
        );
        return;
      }

      // obtener los datos del formulario
      const usuarioCorreo = sessionStorage.getItem("email");
      const tituloHabitacion = tituloElement.textContent;
      const fechaEntrada = document.getElementById(
        "fechaComienzoReserva"
      ).value;
      const fechaSalida = document.getElementById("fechaFinalReserva").value;

      if (!usuarioCorreo) {
        console.log("El usuario no está logueado");
        return;
      }

      // fetch de usuarios y habitaciones
      const [usuariosResponse, habitacionesResponse] = await Promise.all([
        fetch("https://servidor-j7p3.onrender.com/usuarios"),
        fetch("https://servidor-j7p3.onrender.com/habitaciones"),
      ]);

      if (!usuariosResponse.ok || !habitacionesResponse.ok) {
        throw new Error("Error al obtener los datos del servidor");
      }

      const usuarios = await usuariosResponse.json();
      const habitaciones = await habitacionesResponse.json();

      const usuario = usuarios.find((u) => u.correo === usuarioCorreo);
      if (!usuario) {
        console.log("Usuario no encontrado");
        return;
      }

      const habitacion = habitaciones.find(
        (h) => h.titulo === tituloHabitacion && h.disponible
      );

      if (!habitacion) {
        console.log(
          "No hay habitaciones disponibles con el título solicitado."
        );
        return;
      }

      // verificar si las fechas ya estan ocupadas
      const fechasOcupadas = (habitacion.fechas || []).some(
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

      // agregar la reserva al usuario
      if (!usuario.reservas) usuario.reservas = [];
      usuario.reservas.push({
        habitacion_id: habitacion.id,
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
      });

      // agregar la reserva a la habitacion
      if (!habitacion.fechas) habitacion.fechas = [];
      habitacion.fechas.push({
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
      });

      // Actualizar en el servidor
      await Promise.all([
        fetch(`https://servidor-j7p3.onrender.com/usuarios/${usuario.id}`, {
          method: "PUT",
          body: JSON.stringify(usuario),
          headers: { "Content-Type": "application/json" },
        }),
        fetch(
          `https://servidor-j7p3.onrender.com/habitaciones/${habitacion.id}`,
          {
            method: "PUT",
            body: JSON.stringify(habitacion),
            headers: { "Content-Type": "application/json" },
          }
        ),
      ]);

      console.log(
        `Reserva confirmada para ${usuarioCorreo} en la habitación "${tituloHabitacion}" desde ${fechaEntrada} hasta ${fechaSalida}`
      );

      alert("¡Reserva confirmada!");
      document.getElementById("modalReserva").classList.add("hidden");
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert("Ocurrió un error al realizar la reserva. Inténtalo más tarde.");
    }
  }
});

// bloquear fechas ya reservadas en los inputs

function bloquearFechasReservadas(habitaciones) {
  habitaciones.forEach((habitacion) => {
    (habitacion.reservas || []).forEach((reserva) => {
      let option = document.createElement("option");
      option.value = reserva.llegada;
      option.text = `No disponible: ${new Date(
        reserva.llegada
      ).toLocaleDateString()} - ${new Date(
        reserva.salida
      ).toLocaleDateString()}`;
      option.disabled = true;
      document.getElementById("fechaComienzoReserva").appendChild(option);
      document
        .getElementById("fechaFinalReserva")
        .appendChild(option.cloneNode(true));
    });
  });
}
