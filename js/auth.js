export const API = "https://servidor-j7p3.onrender.com";

// Elementos DOM para autenticación y modales
const modalInicio = document.getElementById("modalInicio");
const modalRegistro = document.getElementById("modalRegistro");
const esqInicio = document.getElementById("esquina-sesion");
const esqRegistro = document.getElementById("esquina-registrar");
const formuInicio = document.getElementById("formuInicio");
const formuRegistro = document.getElementById("formuRegistro");

// Cerrar modales
export function cerrarModal(modal) {
  console.log("Intentando cerrar modal con ID:", modal?.id);
  if (modal) {
    modal.classList.add("hidden");
    console.log("Modal cerrado, estado de clase:", modal.classList);
  } else {
    console.log("Modal no encontrado para cerrar");
  }
}

document
  .querySelectorAll(".close, .close-registro, #closeModal, #closeTusReservas")
  .forEach((closeBtn) => {
    closeBtn?.addEventListener("click", () =>
      cerrarModal(closeBtn.closest(".modal") || closeBtn.closest("section[id]"))
    );
  });

window.addEventListener("click", (e) => {
  if (
    e.target.id === "modalInicio" ||
    e.target.id === "modalRegistro" ||
    e.target.id === "modalReserva" ||
    e.target.id === "tusreservas" ||
    e.target.id === "modalMisReservas"
  ) {
    cerrarModal(e.target);
  }
});

// Registro de usuarios
formuRegistro?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pAviso = document.getElementById("aviso");
  const emailRegistro = document.getElementById("emailRegistro").value.trim();
  const contraRegistro = document
    .getElementById("contraseñaRegistro")
    .value.trim();

  if (emailRegistro && contraRegistro) {
    sessionStorage.setItem("email", emailRegistro);
    const usuario = {
      correo: emailRegistro,
      contraseña: contraRegistro,
      reservas: [],
    };

    try {
      const response = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario),
      });
      if (!response.ok) throw new Error("Error al registrar usuario");
      cerrarModal(modalRegistro);
      esqInicio?.classList.add("hidden");
      esqRegistro?.classList.add("hidden");
    } catch (error) {
      console.error("Error en el registro:", error);
      pAviso.innerHTML = `<p>Error al registrar. ${error.message}</p>`;
    }
  }
});

// Inicio de sesión
formuInicio?.addEventListener("submit", async (e) => {
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
        cerrarModal(modalInicio);
        esqInicio?.classList.add("hidden");
        esqRegistro?.classList.add("hidden");
      } else {
        alert("Contraseña incorrecta o usuario no registrado");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al conectar con el servidor: " + error.message);
    }
  }
});

// Gestión de sesión y modales al cargar
document.addEventListener("DOMContentLoaded", async () => {
  const usuarioEmail = sessionStorage.getItem("email");
  if (usuarioEmail) {
    esqInicio?.classList.add("hidden");
    esqRegistro?.classList.add("hidden");
  } else {
    esqInicio?.addEventListener("click", () =>
      modalInicio?.classList.remove("hidden")
    );
    esqRegistro?.addEventListener("click", () =>
      modalRegistro?.classList.remove("hidden")
    );
  }
});
