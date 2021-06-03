const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/jwt");
const ChatMensajes = require("../models/chatmsg");

const chat = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
  const token = socket.handshake.headers["authorization"];
  const usuario = await comprobarJWT(token);
  if (!usuario) {
    return socket.disconnect();
  }

  //SALAS: global, socket.id, usuario.id

  chat.conectarUsuario(usuario);
  io.emit("usuarios-activos", chat.usuariosArr);
  socket.emit("recibir-mensajes", chat.ultimos10);

  //CONEXION A SALA PRIVADA
  socket.join(usuario.id);

  //lIMPIAR USUARIOS CONECTADOS
  socket.on("disconnect", () => {
    chat.desconectarUsuario(usuario.id);
    io.emit("usuarios-activos", chat.usuariosArr);
  });

  //ENVIAR MENSAJE
  socket.on("enviar-mensaje", ({ uid, msg }) => {
    if (uid) {
      //Mensaje privado
      socket.to(uid).emit("mensaje-privado", { de: usuario.nombre, msg });
    } else {
      //Mensaje global
      chat.enviarMensaje(usuario.id, usuario.nombre, msg);
      io.emit("recibir-mensajes", chat.ultimos10);
    }
  });
};

module.exports = { socketController };
