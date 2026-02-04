const express = require("express");
const routes = express.Router();

const passwordResetTokenController = require("../controllers/password_reset_token.controller");

routes.post("/request", passwordResetTokenController.create);
routes.get("/validate/:token", passwordResetTokenController.verificaToken);
routes.post("/confirm", passwordResetTokenController.updateSenha);

module.exports = routes;