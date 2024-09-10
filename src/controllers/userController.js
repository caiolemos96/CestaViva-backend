import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import entidade from "../models/entidade.js";
class UserController {
  static async cadastrarUsuario(req, res) {
    try {
      const idUsuarioLogado = req.userId;
      const acharEntidade = await entidade.findOne({
        usuarios: { $in: [idUsuarioLogado] },
      }); //verifica e acha a entidade que o usuario logado pertence 

      const { nome, email, senha } = req.body;

      //Verifica se usuario existe
      const userExiste = await User.findOne({ email: email });

      if (userExiste) {
        return res
          .status(422)
          .json({ msg: "Email ja cadastrado, utilize outro " });
      }

      //criar senha

      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      //criar usuario

      const user = new User({
        nome,
        email,
        senha: senhaHash,
      });

      await user.save();
      await entidade.findByIdAndUpdate(acharEntidade._id, {
        $push: { usuarios: user._id },
      });

      return res
        .status(201)
        .json({ msg: "Usuário criado com sucesso e adicionado à entidade!" });
    } catch (error) {
      res.status(500).json({ msg: `o seguinte erro ocorreu: ${error}` });
    }
  }

  //-------------------------------------------------------------------------------------------------------------

  static async loginUsuario(req, res) {
    const { email, senha } = req.body;

    //validações
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatorio" });
    }

    if (!senha) {
      return res.status(422).json({ msg: "A senha é obrigatoria" });
    }

    //Verifica se usuario existe
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Usuario não encontrado!" });
    }

    //Verifica se a senha é compativel
    const checkSenha = await bcrypt.compare(senha, user.senha);

    if (!checkSenha) {
      return res.status(404).json({ msg: "Senha Invalida!" });
    }

    try {
      const secret = process.env.SECRET;
      const token = jwt.sign(
        {
          id: user._id,
        },
        secret
      );

      res
        .status(200)
        .json({ msg: "Autenticação realizada com sucesso", token });
    } catch (error) {
      res.status(500).json({
        msg: `Ocorreu um erro no servidor ${error}`,
      });
    }
  }

  static async verificaUsuarioExiste(req, res) {
    const id = req.params.id;

    //verifica se o usuario existe
    const user = await User.findById(id, "-senha");
    if (!user) {
      return res.status(404).json({ msg: "Usuario nao encontrado" });
    }
    res.status(200).json({ user });
  }
}

export default UserController;
