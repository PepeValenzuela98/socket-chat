const { Router } = require("express");
const { check } = require("express-validator");
const {
  login,
  googleSignIn,
  renovarToken,
} = require("../controllers/auth.controller");
const { validarToken } = require("../middlewares");
const { validarCampos } = require("../middlewares/validarCampos");

const router = Router();

router.get("/", validarToken, renovarToken);

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/google",
  [check("idToken", "El id token es necesario").not().isEmpty(), validarCampos],
  googleSignIn
);

module.exports = router;
