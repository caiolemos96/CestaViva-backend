import express from "express";
import checkToken from "../middlewares/authToken.js";
import produtoController from "../controllers/produtoController.js";

const routes = express.Router();

//Rotas privadas

//rotas ok
routes.post(
  "/cestas/:cestaId/cadastrarProduto",
  checkToken,
  produtoController.cadastrarProduto
);
routes.post(
  "/cestas/:cestaId/produtos/:produtoId/baixa",
  checkToken,
  produtoController.darBaixaProduto
);
routes.get(
  "/cestas/:cestaId/produtos",
  checkToken,
  produtoController.retornarProdutos
);

routes.delete(
  "/cestas/:cestaId/produtos/:produtoId/delete",
  checkToken,
  produtoController.deletarProduto
);

export default routes;
