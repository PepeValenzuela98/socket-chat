const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const {Usuario} = require("../models");

const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);
  res.json({ total, usuarios });
};

const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);
  await usuario.save();
  res.status(201).json(usuario);
};

const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...usuario } = req.body;
  if (password) {
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
  }
  const usuarioActual = await Usuario.findByIdAndUpdate(id, usuario, {
    new: true,
  });
  res.status(201).json({ usuario: usuarioActual });
};

const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const usuario = await Usuario.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json({ usuario, usuarioAutenticado: req.usuario });
};
const usuariosPatch = (req = request, res = response) => {
  res.status(200).json({ msg: "API PATH" });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
};
