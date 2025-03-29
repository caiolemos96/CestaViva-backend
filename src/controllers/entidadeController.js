import mongoose from "mongoose";
import entidade from "../models/entidade.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import send from "../services/nodemailer.js";
import { generateEmailWelcome } from "../services/emailGenerator.js";
import cesta from "../models/modeloCesta.js";
import produtoModelo from "../models/modeloProduto.js";

class EntidadeController {
  static async listarEntidades(req, res) {
    try {
      const listaEntidades = await entidade.find({}); // .find é um metodo do mongoose que busca todos os dados do banco de dados
      res.status(200).json(listaEntidades); // convertendo a resposta para retornar um json
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

      // Verificar se o usuário já existe pelo e-mail
      const usuarioExistente = await User.findOne({ email: usuario.email });
      if (usuarioExistente) {
        return res.status(400).json({
          message: "Já existe um usuário cadastrado com este e-mail",
        });
      }

      // Criar a senha com hash
      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(usuario.senha, salt);

      // Criar o usuário
      const usuarioCriado = await User.create({ ...usuario, senha: senhaHash });

      // Criar a entidade com o ID do usuário criado
      const novaEntidade = await entidade.create({
        ...entidadeData,
        usuarios: [usuarioCriado._id],
      });

      // Enviar e-mail de boas-vindas com Mailgen
      try {
        const subject = "Bem-vindo ao Cesta Viva!";
        const { emailBody, emailText } = generateEmailWelcome(
          usuarioCriado.nome
        );

        await send(usuarioCriado.email, subject, emailText, emailBody); // Envio de e-mail em HTML e texto puro
      } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
      }

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

  static async getPerfilEntidade(req, res) {
    try {
      const { userId } = req; //id recebido do middleware e armazenado na requisicao
      const entidadeEncontrada = await entidade.findOne({ usuarios: userId }); //acha a entidade em que o id pertence
      if (!entidadeEncontrada) {
        //se for falso (nao houver entidade encontrada), retorna erro
        return res.status(404).json({ msg: "Entidade não encontrada" });
      }
      return res.status(200).json(entidadeEncontrada); //caso contrario vai retornar o objeto da entidade pra renderizar no perfil
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha na requição de perfil de entidade`,
      });
    }
  }

  static async adicionarImagemEDescricao(req, res) {
    try {
      const { userId } = req; // Recebendo o id do usuário logado a partir do middleware
      const { descricao, imagem } = req.body; // Dados a serem adicionados (imagem e descrição)

      // Buscar a entidade vinculada ao usuário logado
      const entidadeEncontrada = await entidade.findOne({ usuarios: userId });
      if (!entidadeEncontrada) {
        return res.status(404).json({ msg: "Entidade não encontrada" });
      }

      // Atualizar a descrição e adicionar a nova imagem ao array de imagens, se fornecidas
      if (descricao) entidadeEncontrada.descricao = descricao;
      if (imagem) entidadeEncontrada.imagem = imagem;

      // Salvar as alterações na entidade
      await entidadeEncontrada.save();

      res.status(200).json({
        msg: "Descrição e imagem adicionadas com sucesso",
        entidade: entidadeEncontrada,
      });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - Falha ao adicionar descrição e imagem`,
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
        message: `${erro.message} - falha na requisição de atualização `,
      });
    }
  }

  static async excluirEntidadePorId(req, res) {
    try {
      const id = req.params.id;
      await entidade.deleteOne({ _id: id });
      res.status(200).json({ message: "Cadastro excluido com sucesso!" });
    } catch (erro) {
      res.status(500).json({
        message: `${erro.message} - falha ao excluir `,
      });
    }
  }


  static async listarProdutosPorEntidade(req, res) {
    try {
      const { entidadeId } = req.params;

      // 1. Validar o ID da Entidade
      if (!mongoose.Types.ObjectId.isValid(entidadeId)) {
        return res.status(400).json({ message: "ID de entidade inválido." });
      }


      // 2. Verificar se a entidade existe (bom para dar feedback 404)
      const entidadeExistente = await entidade
        .findById(entidadeId)
        .select("_id");
      if (!entidadeExistente) {
        return res.status(404).json({ message: "Entidade não encontrada." });
      }


      // 3. Encontrar todas as Cestas (IDs) associadas à Entidade
      const cestasDaEntidade = await cesta
        .find({ entidade: entidadeId })
        .select("_id");
      // Se não houver cestas, retorna array vazio (nenhum produto)
      if (cestasDaEntidade.length === 0) {
        return res.status(200).json([]);
      }

      // Extrai apenas os IDs
      const cestaIds = cestasDaEntidade.map((c) => c._id);


      // 4. Encontrar todos os Produtos cujo cestaId está na lista de IDs encontrada e popular os dados da Cesta associada.
      const produtos = await produtoModelo
        .find({ cestaId: { $in: cestaIds } })
        .populate({
          path: "cestaId",            // O campo no modelo Produto que referencia Cesta
          select: "nomeCampanha _id", // Seleciona quais campos da Cesta incluir
        })
        .lean(); // .lean(), retorna objetos JS puros (melhor performance)


      // 5. Formatar a resposta para clareza
      //    Renomeia 'cestaId' (que agora é um objeto populado) para 'cesta'
      const produtosFormatados = produtos.map((p) => {
        const { cestaId, ...restoDoProduto } = p;
        return {
          ...restoDoProduto,
          cesta: {
            // Cria um campo 'cesta' mais explícito
            _id: cestaId._id,
            nomeCampanha: cestaId.nomeCampanha,
          },
        };
      });

      // 6. Retornar a lista de produtos formatados
      return res.status(200).json(produtosFormatados);
    } catch (erro) {
      console.error("Erro ao listar produtos por entidade:", erro);
      res.status(500).json({
        message: `${erro.message} - Falha na requisição de produtos da entidade.`,
      });
    }
  }
}

export default EntidadeController;
