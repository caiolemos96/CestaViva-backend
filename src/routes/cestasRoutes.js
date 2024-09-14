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

//Rotas privadas
routes.get(
  "/cesta",
  checkToken,
  CestaController.cadastrarModeloCesta
);

export default routes;
