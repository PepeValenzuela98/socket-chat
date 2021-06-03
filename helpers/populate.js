const usuario = (usuario) => {
  const { _id: uid, ...usuarioResto } = usuario;
  return usuarioResto.correo ? { uid, ...usuarioResto } : uid;
};

const categoria = (categoria) => {
  const { _id: uid, ...categoriaResto } = categoria;
  return categoriaResto.nombre ? { uid, ...categoriaResto } : uid;
};

module.exports = { usuario, categoria };
