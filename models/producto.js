const { Schema, model } = require("mongoose");
const { usuario, categoria } = require("../helpers/populate");

const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: { type: Boolean, default: true, required: true },
  precio: {
    type: Number,
    default: 0,
  },
  descripcion: {
    type: String,
    default: "",
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...producto } = this.toObject();
  return {
    uid: _id,
    ...producto,
    usuario: usuario(producto.usuario),
    categoria: categoria(producto.categoria),
  };
};

module.exports = model("Producto", ProductoSchema);
