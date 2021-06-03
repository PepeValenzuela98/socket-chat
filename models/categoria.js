const { Schema, model } = require("mongoose");
const { usuario } = require("../helpers/populate");
const CategoriaSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: { type: Boolean, default: true, required: true },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

CategoriaSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...categoria } = this.toObject();
  return {
    uid: _id,
    ...categoria,
    usuario: usuario(categoria.usuario),
  };
};

module.exports = model("Categoria", CategoriaSchema);
