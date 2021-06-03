const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarToken, tieneRol } = require("../middlewares");
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos.controller");
const { productoExiste, categoriaExiste } = require("../helpers");
const router = Router();

/**
 *{{url}}/api/productos
 */

router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  obtenerProducto
);

//Crear un producto - privado - token valido
router.post(
  "/",
  [
    validarToken,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria.uid", "id de Categoria no es un ID valido").isMongoId(),
    check("categoria.uid").custom(categoriaExiste),
    validarCampos,
  ],
  crearProducto
);

//Actualizar producto por id - privado - token valido
router.put(
  "/:id",
  [
    validarToken,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(productoExiste),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarProducto
);

//Borrar un producto por id - privado - ADMIN - token valido
router.delete(
  "/:id",
  [
    validarToken,
    tieneRol("ADMIN_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(productoExiste),
    validarCampos,
  ],
  borrarProducto
);
module.exports = router;
