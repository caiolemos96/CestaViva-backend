import entidade from "../models/entidade.js";
import User from "../models/User.js";

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
      const { usuario, ...entidadeData } = req.body;

      // Verificar se a entidade já existe pelo CNPJ
      const entidadeExistente = await entidade.findOne({
        cnpj: entidadeData.cnpj,
      });
      if (entidadeExistente) {
        return res.status(400).json({
          message: "Entidade já cadastrada com este CNPJ",
          entidade: entidadeExistente,
        });
      }

      // Criar o usuário
      const usuarioCriado = await User.create(usuario);

      // Criar a entidade com o ID do usuário criado
      const novaEntidade = await entidade.create({
        ...entidadeData,
        usuarios: [usuarioCriado._id],
      });

      res.status(201).json({
        message: "Entidade e usuário cadastrados com sucesso",
        entidade: novaEntidade,
        usuario: usuarioCriado,
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha ao cadastrar entidade e usuário`,
      });
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
      await entidade.deleteOne({_id: id});
      res.status(200).json({ message: "Cadastro excluido com sucesso!" });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha ao excluir `,
      });
    }
  }

  static async cadastrarUsuario(req, res) {
    try {
      const id = req.params.id;
      const { usuario, ...entidadeData } = req.body;

      // Verificar se a entidade já existe pelo CNPJ
      const entidadeExistente = await entidade.findOne({
        cnpj: entidadeData.cnpj,
      });
      if (entidadeExistente) {
        return res.status(400).json({
          message: "Entidade já cadastrada com este CNPJ",
          entidade: entidadeExistente,
        });
      }

      // Criar o usuário
      const usuarioCriado = await User.create(usuario);

      // Criar a entidade com o ID do usuário criado
      const novaEntidade = await entidade.create({
        ...entidadeData,
        usuarios: [usuarioCriado._id],
      });

      res.status(201).json({
        message: "Entidade e usuário cadastrados com sucesso",
        entidade: novaEntidade,
        usuario: usuarioCriado,
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha ao cadastrar entidade e usuário`,
      });
    }
  }

}

export default EntidadeController;
