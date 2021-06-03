const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://node-cafe-udemy.herokuapp.com/api/auth/";

let socket = null;
let usuario = null;

//REF HTML
const txtUid = document.querySelector("#textUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarToken = async () => {
  try {
    const token = localStorage.getItem("token") || "";
    if (token.length <= 10) {
      window.location = "index.html";
      throw new Error("No hay token en el servidor");
    }
    const response = await fetch(url, { headers: { authorization: token } });
    const { usuario: usuarioDB, token: tokenDB } = await response.json();
    localStorage.setItem("token", tokenDB);
    usuario = usuarioDB;
    document.title = usuario.nombre;
    socket = await conectarSocket();
  } catch (error) {
    console.log(error);
  }
};

const conectarSocket = async () => {
  const socketServer = io({
    extraHeaders: {
      Authorization: localStorage.getItem("token"),
    },
  });

  socketServer.on("connect", () => {
    console.log("Socket online");
  });

  socketServer.on("disconnect", () => {
    console.log("Socket offline");
  });

  socketServer.on("recibir-mensajes", dibujarMensajes);

  socketServer.on("usuarios-activos", dibujarUsuarios);

  socketServer.on("mensaje-privado", (payload) => {
    console.log("Privado: ", payload);
  });

  return socketServer;
};

const dibujarUsuarios = (usuarios = []) => {
  let usersHtml = "";
  usuarios.forEach(({ nombre, uid }) => {
    usersHtml += `
    <li>
      <p>
        <h5 class="text-success">${nombre}</h5>
        <span class="btn fs-6 text-muted" id="span-uid">${uid}</span>
      </p>
    </li>`;
  });
  ulUsuarios.innerHTML = usersHtml;
  const spanUid = document.querySelectorAll("#span-uid");
  spanUid.forEach((el) => {
    el.addEventListener("click", () => {
      uidFill(el.innerHTML);
    });
  });
};

const uidFill = (uid) => {
  txtUid.value = uid;
};

const dibujarMensajes = (mensajes = []) => {
  let msgsHtml = "";
  mensajes.forEach(({ nombre, mensaje }) => {
    msgsHtml += `
    <li>
      <p>
        <span class="text-primary">${nombre}</span>
        <span>${mensaje}</span>
      </p>
    </li>`;
  });
  ulMensajes.innerHTML = msgsHtml;
};

txtMensaje.addEventListener("keyup", ({ keyCode }) => {
  const msg = txtMensaje.value;
  const uid = textUid.value;
  if (keyCode !== 13) {
    return;
  }
  if (msg.length === 0) {
    return;
  }
  socket.emit("enviar-mensaje", { uid, msg });
  txtMensaje.value = "";
});

const main = async () => {
  await validarToken();
};

main();
