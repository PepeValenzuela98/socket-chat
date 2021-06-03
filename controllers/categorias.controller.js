const { request, response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .populate("usuario", "_id nombre correo")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({ total, categorias });
};

//obtenerCategoria - populate
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "_id nombre correo");
  res.json({ categoria });
};

const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });
  if (categoriaDB) {
    return res
      .status(400)
      .json({ msg: `La categoria ${categoriaDB.nombre}, ya existe` });
  }
  //Generar la data a guardar
  const data = { nombre, usuario: req.usuario._id };
  const categoria = new Categoria(data);
  await categoria.save();
  res.status(201).json({ categoria });
};

//actualizarCategoria
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const nombre = req.body.nombre.toUpperCase();
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { nombre },
    { new: true }
  ).populate("usuario", "_id nombre correo");
  res.status(201).json({ categoria });
};

//borrarCategoria - estado:false
const borrarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  ).populate("usuario", "_id nombre correo");
  res.status(201).json({ categoria });
};

module.exports = {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
};
