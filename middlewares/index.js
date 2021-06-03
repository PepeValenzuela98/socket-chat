const validaCampos = require("./validarCampos");
const validaJwt = require("./validarJwt");
const validaRoles = require("./validarRoles");
const validarArchivos = require("./validarArchivo");
const validarColeccion = require("./validarColeccion");

module.exports = {
  ...validaCampos,
  ...validaJwt,
  ...validaRoles,
  ...validarArchivos,
  ...validarColeccion,
};
