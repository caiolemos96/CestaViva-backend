import entidade from "../models/entidade.js";
import Cesta from "../models/modeloCesta.js";
class CestaController {
  static async cadastrarModeloCesta(req, res) {
    try {
      const idUsuarioLogado = req.userId;
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      }); //verifica e acha a entidade que o usuario logado pertence

      const {
        nomeProduto,
        quantidadeProduto,
        unidadeMedida,
        nomeCampanha,
        comecaEm,
        terminaEm,
      } = req.body;

      //Criar Cesta

      const cesta = new Cesta({
        nomeProduto,
        quantidadeProduto,
        unidadeMedida,
        nomeCampanha,
        comecaEm,
        terminaEm,
      });

      await cesta.save();
      await entidade.findByIdAndUpdate(acharEntidade._id, {
        $push: { cestas: cesta._id },
      });

      return res.status(201).json({ msg: "Cesta cadastrada com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: `o seguinte erro ocorreu: ${error}` });
    }
  }
}

export default CestaController;
