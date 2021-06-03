const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarToken, tieneRol } = require("../middlewares");
const {
  obtenerCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias.controller");
const { categoriaExiste } = require("../helpers");
const router = Router();

/**
 *{{url}}/api/categorias
 */

router.get("/", obtenerCategorias);

router.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear una categoria - privado - token valido
router.post(
  "/",
  [
    validarToken,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar categoria por id - privado - token valido
router.put(
  "/:id",
  [
    validarToken,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(categoriaExiste),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarCategoria
);

//Borrar una categoria por id - privado - ADMIN - token valido
router.delete(
  "/:id",
  [
    validarToken,
    tieneRol("ADMIN_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(categoriaExiste),
    validarCampos
  ],
  borrarCategoria
);

module.exports = router;
