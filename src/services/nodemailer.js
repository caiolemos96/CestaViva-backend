import nodemailer from "nodemailer";

//Utiliza variaveis de ambiente, verifique com o Caio os dados
//funcao do nodemailer (biblioteca) que cria o transporte de email e define o modelo de transporte
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  logger: true,
  debug: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

//define modelo transporte
const send = async (to, subject, text, html) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log("E-mail enviado com sucesso:", info.messageId);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
};

export default send;
