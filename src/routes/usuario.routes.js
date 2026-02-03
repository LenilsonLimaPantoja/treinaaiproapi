const express = require("express");
const routes = express.Router();

const login = require("../middleware/login");
const usuarioController = require("../controllers/usuario.controller");

routes.post("/login", usuarioController.login);
routes.post("/", usuarioController.create);

routes.get("/me", login.obrigatorioLogin, usuarioController.me);
routes.put("/me", login.obrigatorioLogin, usuarioController.updateMe);
routes.delete("/me", login.obrigatorioLogin, usuarioController.deleteMe);

routes.get("/", login.obrigatorioLogin, usuarioController.readAll);

module.exports = routes;
