import express from "express";
import UserController from "../controllers/userController.js";
import checkToken from "../middlewares/authToken.js";

const routes = express.Router();

//Apenas rota de teste
routes.get("/user/:id", checkToken, UserController.verificaUsuarioExiste);

//Login Usuario OK
routes.post("/auth/login", UserController.loginUsuario);

export default routes;
