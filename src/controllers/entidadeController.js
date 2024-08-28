import entidade from "../models/entidade.js";

class EntidadeController {
  static async listarEntidades(req, res) {
    try {
      const listaEntidades = await entidade.find({}); //find é um metodo do mongoose
      res.status(200).json(listaEntidades); //convertendo a resposta para retornar um json
    } catch (erro) {
      res
        .status(500)
        .json({ message: `${erro.message} - falha na requisição ` });
    }
  }

  static async listarEntidadePorId(req, res) {
    try {
      const id = req.params.id;
      const entidadeEncontrada = await entidade.findById(id); //metodo mongoose recebendo id dos params
      res.status(200).json(entidadeEncontrada);
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha na requisição da entidade `,
      });
    }
  }

  static async cadastrarEntidade(req, res) {
    try {
      const novaEntidade = await entidade.create(req.body); //Model chamando create(mongoose) passando via body
      res.status(201).json({
        message: "Entidade cadastrada com sucesso",
        entidade: novaEntidade,
      });
    } catch (erro) {
      res
        .status(500)
        .json({ message: `${erro.message} - falha ao cadastrar entidade` });
    }
  }

  static async atualizarEntidadePorId(req, res) {
    try {
      const id = req.params.id;
      await entidade.findByIdAndUpdate(id, req.body); //metodo mongoose recebendo id dos params
      res.status(200).json({ message: "Cadastro atualizado" });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha na requisição na atualização `,
      });
    }
  }

  static async excluirEntidadePorId(req, res) {
    try {
      const id = req.params.id;
      await entidade.findByIdAndDelete(id, req.body);
      res.status(200).json({ message: "Cadastro excluido com sucesso!" });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha ao excluir `,
      });
    }
  }
}

export default EntidadeController;
