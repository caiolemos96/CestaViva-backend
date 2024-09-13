import express from "express";
import checkToken from "../middlewares/authToken.js";
import CestaController from "../controllers/cestasController.js";

const routes = express.Router();

//Rotas privadas
routes.post(
  "/cestas/cadastrarCesta",
  checkToken,
  CestaController.cadastrarModeloCesta
);
routes.get(
  "/cestas",
  checkToken,
  CestaController.retornarCestas
);

export default routes;
