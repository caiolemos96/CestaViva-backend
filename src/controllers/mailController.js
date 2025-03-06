import User from "../models/User.js";
import send from "../services/nodemailer.js";

class MailController {
  static async sendMail(req, res) {
    try {
      const { to, subject, body } = req.body;
      send(to, subject, body);
      return res.status(201).json({ msg: "Email enviado com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: `o seguinte erro ocorreu: ${error}` });
    }
  }

  static async sendMailSuporte(req, res) {
    try {
      const { subject, imageLinks, mensagem } = req.body;
      const to = process.env.MAIL_SUPORT;
      const idUsuarioLogado = req.userId;
      const usuario = await User.findById(idUsuarioLogado);
      const emailUsuario = usuario.email;
      const text = `Email do usuário: ${emailUsuario} \n Mensagem: ${mensagem}\n \n Print do erro ${imageLinks}`;
      // Enviar o e-mail

      await send(to, subject, text);

      return res.status(201).json({ msg: "Email enviado com sucesso" });
    } catch (error) {
      res.status(500).json({ msg: `O seguinte erro ocorreu: ${error}` });
    }
  }
}

export default MailController;
