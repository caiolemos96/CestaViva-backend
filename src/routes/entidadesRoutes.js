import express from "express";
import EntidadeController from "../controllers/entidadeController.js";
import checkToken from "../middlewares/authToken.js";

const routes = express.Router();

routes.get("/entidades", EntidadeController.listarEntidades);
routes.get("/entidades/:id", EntidadeController.listarEntidadePorId);
routes.post("/entidades", EntidadeController.cadastrarEntidade);
routes.post("/entidades/:id/usuario",checkToken, EntidadeController.cadastrarEntidade);
routes.put("/entidades/:id", EntidadeController.atualizarEntidadePorId);
routes.delete("/entidades/:id", EntidadeController.excluirEntidadePorId);

export default routes;
