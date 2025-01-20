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

//carrusel de imagenes
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

derecha.addEventListener("click", (e) => {
  console.log(contCarrusel);
  contCarrusel += 1;
  console.log(contCarrusel);
  let im = document.createElement("img");
  im.setAttribute("src", `imgs/${currentImgsCarrusel[contCarrusel]}`);
  im.setAttribute("id", `im-carrusel`);
  let imm = document.getElementById("im-carrusel");
  carrusel.replaceChild(im, imm);

  if (contCarrusel >= 4) {
    contCarrusel = -1;
  }
});

izquierda.addEventListener("click", (e) => {
  console.log(contCarrusel);
  contCarrusel -= 1;
  console.log(contCarrusel);
  let im = document.createElement("img");
  im.setAttribute("src", `imgs/${currentImgsCarrusel[contCarrusel]}`);
  im.setAttribute("id", `im-carrusel`);
  let imm = document.getElementById("im-carrusel");
  carrusel.replaceChild(im, imm);

  if (contCarrusel < 0) {
    contCarrusel = 4;
    im.setAttribute("src", `imgs/${imgsCarrusel[4]}`);
    im.setAttribute("id", `im-carrusel`);
    carrusel.replaceChild(im, imm);
  }
});

let contHabitaciones = document.getElementById("cont-habitaciones");

const dibujarHabitaciones = (elemHtml) => {
  elemHtml.innerHTML = "";
  fetch("../data-base/habitaciones.json")
    .then((response) => response.json())
    .then((data) =>
      data.habitaciones.forEach((habitacion, index) => {
        if (sessionStorage.getItem("email")) {
          elemHtml.innerHTML += `
              <div
                class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="${habitacion.img}"
                  alt="${habitacion.descripcion}"
                  class="w-full h-48 object-cover img-habitacion"
                />
                <div class="p-4">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">
                    ${habitacion.titulo}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4">
                    ${habitacion.descripcion}
                  </p>
                  <ul class="text-sm text-gray-500">
                    <li>✔ Wi-Fi</li>
                    <li>✔ TV</li>
                    <li>✔ Baño privado</li>
                  </ul>
                  <h3 class="text-xl font-bold text-green-800 mb-2 my-2">
                    ${habitacion.precio}
                  </h3>
                </div>
                <div class="p-3 flex justify-center">
                  <button class="permitir-reservar bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${index}">
                    Reservar
                  </button>
                </div>
              </div>`;
        } else {
          elemHtml.innerHTML += `
              <div
                class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="${habitacion.img}"
                  alt="${habitacion.descripcion}"
                  class="w-full h-48 object-cover img-habitacion"
                />
                <div class="p-4">
                  <h3 class="text-xl font-bold text-gray-800 mb-2">
                    ${habitacion.titulo}
                  </h3>
                  <p class="text-gray-600 text-sm mb-4">
                    ${habitacion.descripcion}
                  </p>
                  <ul class="text-sm text-gray-500">
                    <li>✔ Wi-Fi</li>
                    <li>✔ TV</li>
                    <li>✔ Baño privado</li>
                  </ul>
                  <h3 class="text-xl font-bold text-green-800 mb-2 my-2">
                    ${habitacion.precio}
                  </h3>
                </div>
                <div class="p-3 flex justify-center">
                  <button class="reservar bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${index}">
                    Reservar
                  </button>
                </div>
              </div>`;
        }
      })
    );
};

let contServicios = document.getElementById("cont-servicios");

const dibujarServicios = (elemHtml) => {
  elemHtml.innerHTML = "";
  fetch("../data-base/habitaciones.json")
    .then((response) => response.json())
    .then((data) =>
      data.servicios.forEach((servicio) => {
        elemHtml.innerHTML += `
              <div
                class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="${servicio.img}"
                  alt="${servicio.descripcion}"
                  class="w-full h-48 object-cover img-servicio"
                />
                <div class="p-4">
                  <h3 class="text-xl font-bold text-gray-800 mb-2 text-center">
                    ${servicio.descripcion}
                  </h3>
                </div>
              </div>`;
      })
    );
};

dibujarHabitaciones(contHabitaciones);
dibujarServicios(contServicios);

const modal = document.getElementById("myModal");

const span = document.getElementsByClassName("close")[0];

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("reservar")) {
    modal.style.display = "block";
  }
});

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

//registro
const formuRegistro = document.getElementById("formuRegistro");

formuRegistro.addEventListener("submit", (e) => {
  let pAviso = document.getElementById("aviso");
  e.preventDefault();
  let emailRegistro = document.getElementById("emailRegistro").value.trim();
  let contraRegistro = document
    .getElementById("contraseñaRegistro")
    .value.trim();
  console.log(emailRegistro, contraRegistro);

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
        if (data.length == 0) {
          fetch("https://servidor-j7p3.onrender.com/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario),
          })
            .then((respuesta) => respuesta.json())
            .then((lista) => console.log(lista));
        } else {
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (element.correo == emailRegistro) {
              console.log("ya existe");
              pAviso.innerHTML += `<p>El usuario ${emailRegistro} ya esta registrado</p>`;
            } else {
              fetch("https://servidor-j7p3.onrender.com/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario),
              })
                .then((respuesta) => respuesta.json())
                .then((lista) => console.log(lista));
              break;
            }
          }
        }
      });
  }
});

// Función de inicio de sesión
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

// Mostrar el formulario de reserva solo si el usuario está logueado
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

//
// Función para renderizar el formulario de reservas
const dibujarFormReservas = (comparador, form) => {
  fetch("../data-base/habitaciones.json")
    .then((response) => response.json())
    .then((data) => {
      data.habitaciones.forEach((habitacion) => {
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

          return;
        }
      });
    })
    .catch((error) => console.error("Error cargando habitaciones:", error));
};

// Evento para manejar la confirmación de reservas
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

      // Obtener los datos del formulario
      const usuarioCorreo = sessionStorage.getItem("email");
      const tituloHabitacion = tituloElement.textContent; // Usar textContent para obtener el texto del h2
      const fechaEntrada = document.getElementById(
        "fechaComienzoReserva"
      ).value;
      const fechaSalida = document.getElementById("fechaFinalReserva").value;

      if (!usuarioCorreo) {
        console.log("El usuario no está logueado");
        return;
      }

      // fetch de usuarios y habitaciones desde el servidor
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

      if (habitacion) {
        const fechasOcupadas = habitacion.fechas.some(
          (f) =>
            (fechaEntrada >= f.fecha_entrada &&
              fechaEntrada <= f.fecha_salida) ||
            (fechaSalida >= f.fecha_entrada && fechaSalida <= f.fecha_salida)
        );

        if (fechasOcupadas) {
          console.log(
            "La habitación no está disponible en las fechas solicitadas."
          );
          return;
        }

        // Agregar la reserva
        if (!usuario.reservas) usuario.reservas = [];
        usuario.reservas.push({
          habitacion_id: habitacion.id,
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
        });

        if (!habitacion.fechas) habitacion.fechas = [];
        habitacion.fechas.push({
          fecha_entrada: fechaEntrada,
          fecha_salida: fechaSalida,
        });

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
          `Reserva confirmada para el usuario ${usuarioCorreo} en la habitación ${tituloHabitacion} desde ${fechaEntrada} hasta ${fechaSalida}`
        );
      } else {
        console.log(
          "No hay habitaciones disponibles con el título solicitado."
        );
      }
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
    }
  }
});

// Bloquear fechas reservadas
function bloquearFechasReservadas(habitaciones) {
  habitaciones.forEach((habitacion) => {
    habitacion.reservas.forEach((reserva) => {
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
