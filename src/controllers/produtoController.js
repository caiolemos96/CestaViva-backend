import entidade from "../models/entidade.js";
import cesta from "../models/modeloCesta.js";
import produtoModelo from "../models/modeloProduto.js";
import mongoose from "mongoose";

class ProdutoController {
  static async cadastrarProduto(req, res) {
    try {
      // Verifica o usuário logado
      const idUsuarioLogado = req.userId;

      // Acha a entidade a qual o usuário pertence
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      });

      if (!acharEntidade) {
        return res.status(404).json({ msg: "Entidade não encontrada." });
      }

      const { cestaId } = req.params;

      // Extrai os dados do produto e o ID da cesta do corpo da requisição
      const { nomeProduto, metaProduto, quantidadeRecebida, unidadeMedida } =
        req.body;

      // Verifica se o ID da cesta foi passado
      if (!cestaId) {
        return res.status(400).json({ msg: "O ID da cesta é obrigatório." });
      }

      // Verifica se a cesta existe
      const cestaExistente = await cesta.findById(cestaId);
      if (!cestaExistente) {
        return res.status(404).json({ msg: "Cesta não encontrada." });
      }

      // Cria o produto
      const produto = await produtoModelo.create({
        cestaId,
        nomeProduto,
        metaProduto,
        quantidadeRecebida,
        unidadeMedida,
      });

      // Retorna sucesso com os dados do produto
      return res.status(201).json({
        msg: "Produto cadastrado com sucesso",
        produto: produto,
      });
    } catch (erro) {
      // Retorna o erro em caso de falha
      return res
        .status(500)
        .json({ msg: `Erro ao cadastrar produto: ${erro.message}` });
    }
  }

  static async retornarProdutos(req, res) {
    try {
      const idUsuarioLogado = req.userId;

      // Encontra a entidade a qual o usuário pertence
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      });

      if (!acharEntidade) {
        console.log("Entidade não encontrada para o usuário:", idUsuarioLogado);
        return res.status(404).json({ msg: "Entidade não encontrada." });
      }

      // Extrai cestaId dos params
      const { cestaId } = req.params;

      // Verifica se o ID da cesta foi passado e se é válido
      if (!cestaId || !mongoose.Types.ObjectId.isValid(cestaId)) {
        console.log("ID da cesta inválido ou ausente:", cestaId);
        return res
          .status(400)
          .json({ msg: "ID da cesta inválido ou ausente." });
      }

      // Verifica se a cesta existe e pertence à entidade do usuário
      const cestaExistente = await cesta.findOne({
        _id: cestaId,
        entidade: acharEntidade._id, // Verifica que a cesta pertence à entidade
      });

      if (!cestaExistente) {
        console.log(
          "Cesta não encontrada ou não pertence à entidade:",
          cestaId
        );
        return res.status(404).json({
          msg: "Cesta não encontrada ou não pertence à sua entidade.",
        });
      }

      // Localiza os produtos que possuem o ID da cesta
      const produtos = await produtoModelo.find({ cestaId: cestaId });

      if (produtos.length === 0) {
        console.log("Nenhum produto encontrado para a cesta:", cestaId);
      }

      return res.status(200).json(produtos);
    } catch (erro) {
      console.log("Erro ao localizar produtos:", erro.message);
      return res
        .status(500)
        .json({ msg: `Erro ao localizar produtos: ${erro.message}` });
    }
  }

  static async darBaixaProduto(req, res) {
    try {
      const idUsuarioLogado = req.userId;

      // Verifica a entidade do usuário
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      });

      if (!acharEntidade) {
        return res.status(404).json({ msg: "Entidade não encontrada." });
      }

      const { cestaId, produtoId } = req.params;
      const { quantidadeBaixa } = req.body;

      // Verifica se o ID da cesta e do produto são válidos
      if (!cestaId || !mongoose.Types.ObjectId.isValid(cestaId)) {
        return res
          .status(400)
          .json({ msg: "ID da cesta inválido ou ausente." });
      }
      if (!produtoId || !mongoose.Types.ObjectId.isValid(produtoId)) {
        return res
          .status(400)
          .json({ msg: "ID do produto inválido ou ausente." });
      }

      // Verifica se a cesta pertence à entidade
      const cestaExistente = await cesta.findOne({
        _id: cestaId,
        entidade: acharEntidade._id,
      });

      if (!cestaExistente) {
        return res.status(404).json({
          msg: "Cesta não encontrada ou não pertence à sua entidade.",
        });
      }

      // Busca o produto dentro da cesta
      const produto = await produtoModelo.findOne({
        _id: produtoId,
        cestaId: cestaId,
      });

      if (!produto) {
        return res.status(404).json({ msg: "Produto não encontrado." });
      }

      const novaQuantidadeRecebida =
        produto.quantidadeRecebida + quantidadeBaixa;

      let mensagem = "Baixa registrada com sucesso";

      // Verifica se a nova quantidade recebida excede a meta do produto
      if (novaQuantidadeRecebida > produto.metaProduto) {
        mensagem = "PARABÉNS, VOCÊ ULTRAPASSOU A META!";
      }

      // Atualiza a quantidade recebida do produto
      produto.quantidadeRecebida = novaQuantidadeRecebida;

      // Salva a alteração no banco de dados
      await produto.save();

      // Retorna sucesso com a quantidade atualizada e a mensagem
      return res.status(200).json({
        msg: mensagem,
        quantidadeRecebida: produto.quantidadeRecebida,
      });
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: `Erro ao dar baixa no produto: ${erro.message}` });
    }
  }
}

export default ProdutoController;
