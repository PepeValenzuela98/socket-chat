const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const generarJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "4h" },
      (err, token) => {
        if (err) {
          reject("No se pudo generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

const comprobarJWT = async (token = "") => {
  try {
    if (token.length < 10) {
      return null;
    }

    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(uid);
    if (usuario && usuario.estado) {
      return usuario;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

module.exports = {
  generarJWT,
  comprobarJWT,
};
