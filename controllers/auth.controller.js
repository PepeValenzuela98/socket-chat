const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const { Usuario } = require("../models");
const { generarJWT } = require("../helpers");
const { googleVerify } = require("../helpers/googleVerify");

const renovarToken = async (req = request, res = response) => {
  const { usuario } = req;
  const token = await generarJWT(usuario.id);
  res.json({ usuario, token });
};

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;
  try {
    //Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res
        .status(400)
        .json({ msg: "Correo / Password no son correctos - correo" });
    }
    //Verificar si esta activo
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Correo / Password no son correctos - estado: false" });
    }
    //Verificar la contraseña
    const validPass = bcrypt.compareSync(password, usuario.password);
    if (!validPass) {
      return res
        .status(400)
        .json({ msg: "Correo / Password no son correctos - password" });
    }
    //Generar JWT
    const token = await generarJWT(usuario.id);
    res.json({ usuario, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Algo salio mal contacte al administrador" });
  }
};

const googleSignIn = async (req = request, res = response) => {
  try {
    const { idToken } = req.body;
    const { correo, nombre, img } = await googleVerify(idToken);
    let usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      const data = { nombre, correo, password: ":P", google: true, img };
      usuario = await Usuario.create(data);
    }
    if (!usuario.estado) {
      return res
        .status(400)
        .json({ msg: "Hable con el administrador usuario bloqueado" });
    }
    const token = await generarJWT(usuario.id);
    res.json({ usuario, token });
  } catch (error) {
    return res.status(400).json({ msg: "Token de google no es valido" });
  }
};

module.exports = { login, googleSignIn, renovarToken };
