const express = require("express");
const routes = express.Router();

const passwordResetTokenController = require("../controllers/password_reset_token.controller");

routes.get("/:token", passwordResetTokenController.verificaToken);
routes.post("/", passwordResetTokenController.create);

module.exports = routes;
