import express from "express"; //gerencia as rotas
import entidades from "./entidadesRoutes.js"; //importando as rotas de entidades

//funcao para agrupar todas as rotas que vamos receber

const routes = (app) => {
  app.route("/").get((req, res) => res.status(200).send("Curso de Node.JS"));

  //incluir as rotas
  //middleware das rotas que estao vindo de entidadesRoutes, passando tudo pra routes gerenciar
  app.use(express.json(), entidades);
};

export default routes;
