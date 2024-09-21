import express from "express";
import EntidadeController from "../controllers/entidadeController.js";
import checkToken from "../middlewares/authToken.js";
import UserController from "../controllers/userController.js";

const routes = express.Router();

//Rotas Publicas
//RotasOk
routes.get("/entidades", EntidadeController.listarEntidades);
routes.get("/entidades/:id", EntidadeController.listarEntidadePorId);
routes.post("/entidades", EntidadeController.cadastrarEntidade);

//Rotas Privadas
//Rota para cadastrar um usuario a mais na entidade
routes.post(
  "/entidades/cadastrar/usuario",
  checkToken,
  UserController.cadastrarUsuario
);
// rotas para perfil da entidade e edição de perfil
routes.get("/entidade", checkToken, EntidadeController.getPerfilEntidade);
routes.post(
  "/entidade",
  checkToken,
  EntidadeController.adicionarImagemEDescricao
);

//Rotas em teste
routes.put("/entidades/:id", EntidadeController.atualizarEntidadePorId);

routes.delete("/entidades/:id", EntidadeController.excluirEntidadePorId);

export default routes;
