const { Router } = require("express");
const { check } = require("express-validator");
const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
} = require("../controllers/usuarios.controller");
const {
  esRolValido,
  correoExiste,
  idNoExiste,
} = require("../helpers");
const {
  adminRol,
  tieneRol,
  validarCampos,
  validarToken,
} = require("../middlewares");

const router = Router();

router.get("/", usuariosGet);

router.post(
  "/",
  [
    check("correo", "El correo no es valido").isEmail(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password debe tener mas de 6 letras").isLength({
      min: 6,
    }),

    //check("rol", "No es un rol permitido").isIn(["ADMIN_ROLE","USER_ROLE"]),
    check("rol").custom(esRolValido),
    check("correo").custom(correoExiste),
    validarCampos,
  ],
  usuariosPost
);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(idNoExiste),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.delete(
  "/:id",
  [
    validarToken,
    // adminRol,
    tieneRol("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(idNoExiste),
    validarCampos,
  ],
  usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
