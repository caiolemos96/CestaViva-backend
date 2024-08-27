import express from "express";
import conectaNoBanco from "./config/dbConnect.js";
import entidade from "./models/entidade.js";

const conexao = await conectaNoBanco();
conexao.on("error", (erro) => {
  console.error("erro de conexao", erro);
});

conexao.once("open", () => {
  console.log("conexao com o banco feita com sucesso");
});

const app = express();
app.use(express.json()); //Middleware: toda requisicao vai passar por aqui e ser convertido para json

app.get("/", (req, res) => {
  res.status(200).send("Curso de Node.js");
});

app.get("/entidades", async (req, res) => {});

app.get("/entidades/:id", (req, res) => {
  // : informa que o parametro que estou chamando de ID é variavel
  const index = buscaEntidade(req.params.id); //utiliza o parametro passado para rota como argumento da funcao
  if (index === -1) {
    return res.status(404).send("entidade nao encontrada");
  }
  res.status(200).json(entidades[index]); //retornando o resultado da entidade no index buscado pela funcao
});

app.post("/entidades", (req, res) => {
  entidades.push(req.body);
  res.status(201).send("Entidade cadastrada com sucesso!");
});

app.put("/entidades/:id", (req, res) => {
  const index = buscaEntidade(req.params.id);

  if (index === -1) {
    return res.status(404).send("Entidade não encontrada");
  }

  const entidade = entidades[index];

  if (req.body.razaoSocial !== undefined)
    entidade.razaoSocial = req.body.razaoSocial;
  if (req.body.cidade !== undefined) entidade.cidade = req.body.cidade;
  if (req.body.estado !== undefined) entidade.estado = req.body.estado;
  if (req.body.endereco !== undefined) entidade.endereco = req.body.endereco;
  if (req.body.numero !== undefined) entidade.numero = req.body.numero;
  if (req.body.bairro !== undefined) entidade.bairro = req.body.bairro;
  if (req.body.cep !== undefined) entidade.cep = req.body.cep;
  //validações para atualizar somente os campos preenchidos
  res.status(200).json(entidade);
});

app.delete("/entidades/:id", (req, res) => {
  const index = buscaEntidade(req.params.id);
  entidades.splice(index, 1);
  res.status(200).send("Entidade removida com sucesso");
});

export default app;
