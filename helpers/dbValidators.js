const { Usuario, Rol, Categoria, Producto } = require("../models");

const esRolValido = async (rol = "") => {
  const existe = await Rol.findOne({ rol });
  if (!existe) {
    throw new Error(`El rol ${rol} no existe`);
  }
  return true;
};

const correoExiste = async (correo = "") => {
  const existe = await Usuario.findOne({ correo });
  if (existe) {
    throw new Error(`El correo ${correo} ya existe`);
  }
  return true;
};

const idNoExiste = async (id) => {
  const existe = await Usuario.findById(id);
  if (!existe) {
    throw new Error(`El usuario con id ${id} no existe`);
  }
  return true;
};

const categoriaExiste = async (id) => {
  const existe = await Categoria.findById(id);
  if (!existe) {
    throw new Error(`La categoria con id ${id} no existe`);
  }
  return true;
};

const productoExiste = async (id) => {
  const existe = await Producto.findById(id);
  if (!existe) {
    throw new Error(`El producto con id ${id} no existe`);
  }
  return true;
};

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  if (!colecciones.includes(coleccion)) {
    throw new Error(
      `La coleccion ${coleccion} no esta permitida solo, ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  esRolValido,
  correoExiste,
  idNoExiste,
  categoriaExiste,
  productoExiste,
  coleccionesPermitidas,
};
