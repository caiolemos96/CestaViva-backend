import entidade from "../models/entidade.js";
import Cesta from "../models/modeloCesta.js";

class CestaController {
  static async cadastrarModeloCesta(req, res) {
    try {
      const idUsuarioLogado = req.userId;
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      }); //verifica e acha a entidade que o usuario logado pertence

      const { nomeCampanha, comecaEm, terminaEm } = req.body;

      const cesta = await Cesta.create({
        entidade: acharEntidade._id,
        nomeCampanha,
        comecaEm,
        terminaEm,
      });
      return res.status(201).json({ msg: "Cesta criada com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: `o seguinte erro ocorreu: ${error}` });
    }
  }

  static async retornarCesta(req, res) {
    try {
      const idUsuarioLogado = req.userId;
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      }); //verifica e acha a entidade que o usuario logado pertence

      const cesta = await Cesta.create({
        entidade: acharEntidade._id,
        nomeCampanha,
        comecaEm,
        terminaEm,
      });
      return res.status(201).json({ msg: "Cesta criada com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: `o seguinte erro ocorreu: ${error}` });
    }
  }
}

export default CestaController;
