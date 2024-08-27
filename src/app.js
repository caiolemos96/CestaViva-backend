import express from "express";

const app = express();
app.use(express.json()); //Middleware: toda requisicao vai passar por aqui e ser convertido para json

const entidades = [
  {
    id: 1,
    razaoSocial: "Igreja Cristo Rei",
    cidade: "Ribeirao Preto",
    estado: "SP",
    endereco: "R. Arnaldo Victaliano",
    numero: 1237,
    bairro: "Pres. Medici",
    cep: 14091313,
  },

  {
    id: 2,
    razaoSocial: "Igreja Cristo Rei",
    cidade: "Ribeirao Preto",
    estado: "SP",
    endereco: "Av. Pres. Castelo Branco",
    numero: 777,
    bairro: "Lagoinha",
    cep: 14095020,
  },
];

function buscaEntidade(id) {
  return entidades.findIndex((entidade) => {
    return entidade.id === Number(id);
  });
}

app.get("/", (req, res) => {
  res.status(200).send("Curso de Node.js");
});

app.get("/entidades", (req, res) => {
  res.status(200).json(entidades); //convertendo a resposta para retornar um json
});

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

  res.status(200).json(entidade);
});

export default app;
