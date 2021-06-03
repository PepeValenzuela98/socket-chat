const { request, response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "_id nombre correo")
      .populate("categoria", "_id nombre")
      .skip(Number(desde))
      .limit(Number(limite)),
  ]);
  res.json({ total, productos });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "_id nombre correo")
    .populate("categoria", "_id nombre");
  res.json({ producto });
};

const crearProducto = async (req = request, res = response) => {
  const { nombre, precio = 0, descripcion = "" } = req.body;
  const productoDB = await Producto.findOne({ nombre });
  if (productoDB) {
    return res
      .status(400)
      .json({ msg: `El producto ${productoDB.nombre}, ya existe` });
  }
  //Generar la data a guardar
  const data = {
    nombre: nombre.toUpperCase(),
    precio,
    descripcion,
    usuario: req.usuario._id,
    categoria: req.body.categoria.uid,
  };
  const producto = new Producto(data);
  await producto.save();
  res.status(201).json({ producto });
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { precio = 0, descripcion = "" } = req.body;
  const nombre = req.body.nombre.toUpperCase();
  const producto = await Producto.findByIdAndUpdate(
    id,
    { nombre, precio, descripcion },
    { new: true }
  )
    .populate("usuario", "_id nombre correo")
    .populate("categoria", "_id nombre");
  res.status(201).json({ producto });
};

const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  )
    .populate("usuario", "_id nombre correo")
    .populate("categoria", "_id nombre");
  res.status(201).json({ producto });
};
module.exports = {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
};
