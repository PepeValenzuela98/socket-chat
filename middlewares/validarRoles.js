const { response, request } = require("express");

const adminRol = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res
      .status(500)
      .json({ msg: "Se quiere verificar el rol sin validar el token primero" });
  }
  const { rol, nombre } = req.usuario;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es administrador - No puede hacer esta accion`,
    });
  }
  next();
};

const tieneRol = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.usuario) {
      return res
        .status(500)
        .json({
          msg: "Se quiere verificar el rol sin validar el token primero",
        });
    }
    const { rol, nombre } = req.usuario;
    if(!roles.includes(rol)){
        return res.status(401).json({
            msg: `${nombre} no tiene los roles necesarios - No puede hacer esta accion`,
          });
    }

    next();
  };
};

module.exports = { adminRol, tieneRol };
