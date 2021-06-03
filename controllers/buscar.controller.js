const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({ results: usuario ? [usuario] : [] });
  }

  const regex = new RegExp(termino, "i");
  const usuario = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({ total: usuario.length, results: usuario ? [usuario] : [] });
};

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.json({ results: categoria ? [categoria] : [] });
  }
  const regex = new RegExp(termino, "i");
  const categoria = await Categoria.find({ nombre: regex, estado: true });
  res.json({ total: categoria.length, results: categoria ? [categoria] : [] });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.json({ results: producto ? [producto] : [] });
  }
  const regex = new RegExp(termino, "i");
  const producto = await Producto.find({
    $or: [{ nombre: regex }, { descripcion: regex }],
    $and: [{ estado: true, disponible: true }],
  }).populate("categoria", "nombre");
  res.json({ total: producto.length, results: producto ? [producto] : [] });
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;
  if (!coleccionesPermitidas.includes(coleccion)) {
    res
      .status(400)
      .json({ msg: `Las colecciones permitidas son ${coleccionesPermitidas}` });
  }
  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({ msg: "Se me olvido hacer esta busqueda" });
      break;
  }
};

module.exports = {
  buscar,
};
