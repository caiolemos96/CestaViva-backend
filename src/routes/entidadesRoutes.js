import express from "express";
import EntidadeController from "../controllers/entidadeController.js";

const routes = express.Router();

routes.get("/entidades", EntidadeController.listarEntidades);
routes.get("/entidades/:id", EntidadeController.listarEntidadePorId);
routes.post("/entidades", EntidadeController.cadastrarEntidade);
routes.put("/entidades/:id", EntidadeController.atualizarEntidadePorId);
routes.delete("/entidades/:id", EntidadeController.excluirEntidadePorId);

export default routes;
