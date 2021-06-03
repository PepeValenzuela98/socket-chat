const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { createServer } = require("http");
const { dbConnection } = require("../db/config");
const { socketController } = require("../sockets/controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);
    this.paths = {
      usuarios: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
      buscar: "/api/buscar",
      auth: "/api/auth",
      uploads: "/api/uploads",
    };

    //CONEXION A BASE DE DATOS
    this.conectarDb();
    //MIDDLEWARES
    this.middlewares();
    //RUTAS DE MI APLICACION
    this.routes();
    //SOCKETS
    this.sockets();
  }

  async conectarDb() {
    await dbConnection();
  }

  routes() {
    const { usuarios, categorias, productos, buscar, auth, uploads } =
      this.paths;
    this.app.use(usuarios, require("../routes/usuarios.routes"));
    this.app.use(categorias, require("../routes/categorias.routes"));
    this.app.use(productos, require("../routes/productos.routes"));
    this.app.use(buscar, require("../routes/buscar.routes"));
    this.app.use(auth, require("../routes/auth.routes"));
    this.app.use(uploads, require("../routes/uploads.routes"));
  }

  middlewares() {
    //CORS
    this.app.use(cors());
    //LECTURA Y PARSE DEL BODY
    this.app.use(express.json());
    //DIRECTORIO PUBLIC
    this.app.use(express.static("public"));
    //FILEUPLOADS - CARGA DE ARCHIVOS
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  sockets() {
    this.io.on("connection", (socket) => {
      
      socketController(socket, this.io);
    });
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en: ", this.port);
    });
  }
}

module.exports = Server;
