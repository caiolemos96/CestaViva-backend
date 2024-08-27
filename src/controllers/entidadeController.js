import entidade from "../models/entidade.js";

class EntidadeController {
  static async listarEntidades(req, res) {
    const listaEntidades = await entidade.find({}); //find é um metodo do mongoose
    res.status(200).json(listaEntidades); //convertendo a resposta para retornar um json
  }
}

export default EntidadeController;
