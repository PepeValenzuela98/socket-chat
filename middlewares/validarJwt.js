const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const {Usuario} = require("../models/");

const validarToken = async (req = request, res = response, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No hay token en la peticion" });
  }
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    const usuario = await Usuario.findById(uid);
    if (!usuario) {
      return res.status(401).json({ msg: "Usuario no existe en BD" });
    }
    if (!usuario.estado) {
      return res
        .status(401)
        .json({ msg: "Token no valida - usuario con estado:false" });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token no valido" });
  }
};

module.exports = { validarToken };
