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

// dibujo de habitaciones con json
const dibujarHabitaciones = (elemHtml) => {
  elemHtml.innerHTML = "";
  fetch("habitaciones.json")
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

const contHabitaciones = document.getElementById("cont-habitaciones");

dibujarHabitaciones(contHabitaciones);

//modal de inicio de sesion

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

//modal de registro

const modalRegistro = document.getElementById("modalRegistro");

const spanRegistro = document.getElementsByClassName("close-registro")[0];

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("abrir-Registro")) {
    modalRegistro.style.display = "block";
  }
});

spanRegistro.onclick = function () {
  modalRegistro.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if (event.target == modalRegistro) {
    modalRegistro.style.display = "none";
  }
};

//funcion de registro
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
  };

  if (emailRegistro && contraRegistro) {
    sessionStorage.setItem("email", emailRegistro);
    sessionStorage.setItem("contraseña", contraRegistro);

    fetch("http://localhost:3000/usuarios")
      .then((response) => response.json())
      .then((data) => {
        if (data.length == 0) {
          fetch("http://localhost:3000/usuarios", {
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
              pAviso.innerHTML += (
                <p>El usuario ${emailRegistro} ya esta registrado</p>
              );
            } else {
              fetch("http://localhost:3000/usuarios", {
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

//funcion de inicio de sesion
const formuInicio = document.getElementById("formuInicio");
let esqRegistro = document.getElementById("esquina-registrar");
let esqInicio = document.getElementById("esquina-sesion");

formuInicio.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value.trim();
  let contra = document.getElementById("contraseña").value.trim();

  if (email && contra) {
    fetch("http://localhost:3000/usuarios")
      .then((response) => response.json())
      .then((data) => {
        let usuarioValido = false;

        data.forEach((em) => {
          if (em.correo == email && em.contraseña == contra) {
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("contraseña", contra);
            console.log("vamos bien");
            esqInicio.style.display = "none";
            esqRegistro.style.display = "none";
            usuarioValido = true;
            modal.style.display = "none";
            location.reload();
          }
        });

        if (!usuarioValido) {
          alert("Contraseña incorrecta o usuario no registrado");
        }
      });
  }
});

//funcion filtrado reserva

formuReserva.addEventListener("submit", async (event) => {
  event.preventDefault();

  contHabitaciones.style.display = "none";

  const formuReserva = document.getElementById("formuReserva");
  const cantPersonasInput = document.getElementById("cantPersonas");
  const llegadaInput = document.getElementById("llegada");
  const salidaInput = document.getElementById("salida");

  const cantPersonas = parseInt(cantPersonasInput.value, 10);
  const llegada = new Date(llegadaInput.value);
  const salida = new Date(salidaInput.value);

  if (cantPersonas <= 0) {
    alert("El número de personas debe ser mayor a 0");
    formuReserva.reset();
    return;
  }

  if (isNaN(llegada.getTime()) || isNaN(salida.getTime())) {
    alert("Debes ingresar fechas válidas");
    formuReserva.reset();
    return;
  }

  if (llegada >= salida) {
    alert("La fecha de llegada debe ser anterior a la fecha de salida.");
    formuReserva.reset();
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/habitaciones");
    if (!response.ok) {
      throw new Error("Error al obtener las habitaciones");
    }

    const habitaciones = await response.json();
    console.log(habitaciones);

    const habitacionesFiltradas = habitaciones.filter((habitacion) => {
      return habitacion.personas.includes(cantPersonas);
    });

    // Mostrar las habitaciones disponibles
    mostrarHabitaciones(habitacionesFiltradas);
  } catch (error) {
    console.error("Error al obtener las habitaciones: ", error);
    alert("Ocurrio un error al buscar habitaciones. Intenta nuevamente.");
  }

  formuReserva.reset();
});

// Función para mostrar habitaciones en el DOM
function mostrarHabitaciones(habitaciones) {
  const contenedor = document.createElement("div");
  contenedor.className =
    "mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-6";

  if (habitaciones.length === 0) {
    contenedor.innerHTML = (
      <p>No hay habitaciones disponibles para los criterios seleccionados.</p>
    );
  } else {
    habitaciones.forEach((habitacion, index) => {
      const habitacionDiv = document.createElement("div");
      habitacionDiv.innerHTML = `
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
      contenedor.appendChild(habitacionDiv);
    });
  }

  const resultado = document.getElementById("resultado");
  resultado.innerHTML = "";
  resultado.appendChild(contenedor);
}

const modalReserva = document.getElementById("modalReserva");

//funcion de habilitar formulario de reserva

document.addEventListener("DOMContentLoaded", () => {
  const modalReserva = document.getElementById("modalReserva");
  mostrarFormReserva(modalReserva);
});

let eventoAgregado = false;

const mostrarFormReserva = (modalReserva) => {
  if (sessionStorage.getItem("email") && !eventoAgregado) {
    esqInicio.classList.toggle("hidden");
    esqRegistro.classList.toggle("hidden");

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

const dibujarFormReservas = (comparador, form) => {
  fetch("habitaciones.json")
    .then((response) => response.json())
    .then((data) => {
      data.habitaciones.forEach((habitacion) => {
        if (comparador + 1 == habitacion.id) {
          console.log(comparador);
          form.innerHTML = `
            <div class="bg-white rounded-lg max-w-lg w-full p-6 relative">
              <span id="closeModal"
                    class="absolute top-2 right-2 text-xl font-bold text-gray-500 cursor-pointer">&times;</span>
              <h2 class="text-2xl font-semibold text-gray-800 mb-4" id="titulo-buscar">${habitacion.titulo}</h2>
              <p class="text-gray-600 mb-3">${habitacion.descripcion}</p>
              <p class="text-orange-500 text-sm mb-2">WiFi:Si</p>
              <p class="text-orange-500 text-sm mb-2">Máx. Personas: ${habitacion.capacidad}</p>
              <p class="text-orange-500 text-sm mb-2">Disponible: Si</p>
              <p class="text-green-500 text-lg font-semibold mb-4">${habitacion.precio} por noche</p>

              <form id="formReserva" class="space-y-4">
                <div>
                  <label for="fechaComienzoReserva" class="block text-gray-700">Fecha de inicio:</label>
                  <input type="date" id="fechaComienzoReserva" class="w-full border border-gray-300 p-2 rounded-md" required>
                </div>
                <div>
                  <label for="fechaFinalReserva" class="block text-gray-700">Fecha de finalización:</label>
                  <input type="date" id="fechaFinalReserva" class="w-full border border-gray-300 p-2 rounded-md" required>
                </div>
                <button type="submit" class="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
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

//bloquear fecha de habitaciones

const bloquearFechasReservadas = (reservas) => {
  const inputFechaInicio = document.getElementById("fechaComienzoReserva");
  const inputFechaFin = document.getElementById("fechaFinalReserva");

  if (!reservas || reservas.length === 0) return;

  reservas.forEach((reserva) => {
    let option = document.createElement("option");
    option.value = reserva.fecha;
    // option.text = No disponible: ${reserva.fecha};
    option.disabled = true;
    inputFechaInicio.appendChild(option);
    inputFechaFin.appendChild(option.cloneNode(true));
  });
};
