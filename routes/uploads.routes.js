const { Router } = require("express");
const { check } = require("express-validator");
const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
} = require("../controllers/uploads.controller");
const { coleccionesPermitidas } = require("../helpers");

const {
  validarCampos,
  validarArchivo,
  coleccionConImgExiste,
} = require("../middlewares");

const router = Router();

// router.post("/", validarArchivo, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivo,
    check("id", "Este id no es un MongoId").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
    coleccionConImgExiste,
  ],
  actualizarImagen
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "Este id no es un MongoId").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
    coleccionConImgExiste,
  ],
  mostrarImagen
);

module.exports = router;
