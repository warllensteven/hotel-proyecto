import { API } from "./auth.js";

let reservasVisible = false;

const mostrarOcultarReservas = async () => {
  const usuarioCorreo = sessionStorage.getItem("email");
  if (!usuarioCorreo) return;

  const reservasSection = document.getElementById("reservasSection");
  const misReservasBtn = document.getElementById("misReservasBtn");

  if (!reservasVisible) {
    // Mostrar reservas
    reservasSection.innerHTML = `
      <div id="listaReservas" class="flex flex-row space-x-6 overflow-x-auto pb-4">
      </div>`;
    const listaReservas = document.getElementById("listaReservas");

    try {
      const response = await fetch(`${API}/usuarios`);
      const usuarios = await response.json();
      const usuario = usuarios.find((u) => u.correo === usuarioCorreo);

      if (usuario && usuario.reservas && usuario.reservas.length > 0) {
        const habitacionesResponse = await fetch(`${API}/habitaciones`);
        const habitacionesData = await habitacionesResponse.json();
        const habitaciones = habitacionesData.habitaciones || habitacionesData;

        let reservasRenderizadas = 0;
        usuario.reservas.forEach((reserva) => {
          const habitacion = habitaciones.find(
            (h) => h.id === reserva.habitacion_id
          );
          if (habitacion) {
            const reservaDiv = document.createElement("div");
            reservaDiv.className =
              "bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300";
            reservaDiv.innerHTML = `
              <img src="${habitacion.img}" alt="${
              habitacion.tipo
            }" class="w-full h-48 object-cover img-habitacion">
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
                <p class="text-gray-600 text-sm">Fecha de entrada: <span class="font-bold">${
                  reserva.fecha_entrada
                }</span></p>
                <p class="text-gray-600 text-sm">Fecha de entrada: <span class="font-bold">${
                  reserva.fecha_salida
                }</span></p>
              </div>
              <div class="p-3 flex justify-center">
                <button class="cancelar-reserva bg-red-500 text-white font-semibold rounded px-4 py-2 hover:bg-red-600 transition-colors duration-300" data-id="${
                  reserva.habitacion_id
                }" data-entrada="${reserva.fecha_entrada}" data-salida="${
              reserva.fecha_salida
            }">Cancelar</button>
              </div>`;
            listaReservas.appendChild(reservaDiv);
            reservasRenderizadas++;
          }
        });

        // Evento para cancelar reservas
        document.querySelectorAll(".cancelar-reserva").forEach((button) => {
          button.addEventListener("click", async (e) => {
            const habitacionId = e.target.getAttribute("data-id");
            const fechaEntrada = e.target.getAttribute("data-entrada");
            const fechaSalida = e.target.getAttribute("data-salida");

            if (
              confirm(
                `¿Estás seguro de cancelar la reserva para la habitacion ${habitacionId} del ${fechaEntrada} al ${fechaSalida}?`
              )
            ) {
              try {
                const response = await fetch(`${API}/usuarios/${usuario.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    reservas: usuario.reservas.filter(
                      (r) =>
                        !(
                          r.habitacion_id === parseInt(habitacionId) &&
                          r.fecha_entrada === fechaEntrada &&
                          r.fecha_salida === fechaSalida
                        )
                    ),
                  }),
                });
                const data = await response.json();
                if (response.ok) {
                  // Eliminacion de la tarjeta de la vista
                  e.target.closest("div.bg-white").remove();
                  // Recarga las reservas para actualizar la lista
                  if (listaReservas.children.length === 0) {
                    listaReservas.innerHTML =
                      "<p class='text-center text-gray-600'>No tienes reservas.</p>";
                  }
                } else {
                  alert(
                    `Error al cancelar la reserva. codigo: ${
                      response.status
                    }. ${data.message || "Intentalo de nuevo."}`
                  );
                }
              } catch (error) {
                alert("Error al conectar con el servidor. Intentalo de nuevo.");
              }
            }
          });
        });
      } else {
        listaReservas.innerHTML =
          "<p class='text-center text-gray-600'>No tienes reservas.</p>";
      }
    } catch (error) {
      listaReservas.innerHTML =
        "<p class='text-center text-red-500'>Error al cargar tus reservas.</p>";
    }

    misReservasBtn.textContent = "Ocultar Reservas";
    reservasVisible = true;
  } else {
    // Oculta reservas
    reservasSection.innerHTML = "";
    misReservasBtn.textContent = "Mis Reservas";
    reservasVisible = false;
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const misReservasBtn = document.getElementById("misReservasBtn");
  if (misReservasBtn) {
    misReservasBtn.addEventListener("click", mostrarOcultarReservas);
  }
});
