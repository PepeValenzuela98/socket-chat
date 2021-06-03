const { request, response } = require("express");
const { Usuario, Producto } = require("../models");

const coleccionConImgExiste = async (req = request, res = response, next) => {
  const { coleccion, id } = req.params;
  let modelo;
  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      break;
    case "productos":
      modelo = await Producto.findById(id);
      break;
    default:
      res.status(500).json({ msg: "Se me olvido validar esto" });
  }
  if (!modelo) {
    res
      .status(404)
      .json({ msg: `No se encontro el modelo en la coleccion ${coleccion}` });
  }
  req.modelo = modelo;
  next();
};

module.exports = {
  coleccionConImgExiste,
};
