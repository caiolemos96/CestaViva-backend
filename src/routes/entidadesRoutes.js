import express from "express";
import EntidadeController from "../controllers/entidadeController.js";
import checkToken from "../middlewares/authToken.js";
import UserController from "../controllers/userController.js";

const routes = express.Router();

//Rotas Publicas
routes.get("/entidades", EntidadeController.listarEntidades);         //Rota retorna todas entidades
routes.get("/entidades/:id", EntidadeController.listarEntidadePorId); //Rota que lista id por params
routes.post("/entidades", EntidadeController.cadastrarEntidade);      //Rota para Cadastrar Entidade
routes.get("/entidades/:entidadeId/produtos", EntidadeController.listarProdutosPorEntidade);  // Listar produtos por Entidade (ID)


//Rotas Privadas
routes.post("/entidades/cadastrar/usuario", checkToken, UserController.cadastrarUsuario); //Rota para cadastrar um usuario a mais na entidade
routes.get("/entidade", checkToken, EntidadeController.getPerfilEntidade);                // Rota que retorna o perfil da entidade que o usuario que esta logado pertence
routes.post("/entidade", checkToken, EntidadeController.adicionarImagemEDescricao);       // Rota que edita Imagem e Descricao da entidade que o usuario que esta logado pertence


//Rotas em teste pode ignorar
routes.put("/entidades/:id", EntidadeController.atualizarEntidadePorId);
routes.delete("/entidades/:id", EntidadeController.excluirEntidadePorId);

export default routes;
