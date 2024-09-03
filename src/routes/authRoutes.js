import express from "express";
import UserController from "../controllers/userController.js";
import checkToken from "../middlewares/authToken.js";

const routes = express.Router();

//rota privada teste
routes.get("/user/:id", checkToken, UserController.verificaUsuarioExiste);

//registro usuario
routes.post("/auth/register", UserController.cadastrarUsuario);

//Login Usuario
routes.post("/auth/login", UserController.loginUsuario);

export default routes;
