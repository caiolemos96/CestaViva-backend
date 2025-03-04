import Mailgen from "mailgen";

// Configuração do Mailgen
const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Cesta Viva",
    link: "https://cestaviva.com.br/",
  },
});

// Função para gerar e-mail de boas-vindas
export const generateEmailWelcome = (userName) => {
  const email = {
    body: {
      name: userName,
      greeting: "Olá",
      signature: "Atenciosamente",
      intro: "Bem-vindo ao Cesta Viva! Estamos muito felizes em tê-lo conosco.",
      action: {
        instructions: "Para acessar sua conta, clique no botão abaixo:",
        button: {
          color: "#22BC66",
          text: "Acessar conta",
          link: "https://cestaviva.com.br/login",
        },
      },
      outro:
        "Se precisar de ajuda, entre em contato conosco pelo e-mail: contatocestaviva@gmail.com.",
    },
  };

  return {
    emailBody: mailGenerator.generate(email), // Gera o e-mail em HTML
    emailText: mailGenerator.generatePlaintext(email), // Gera versão em texto puro
  };
};

export const generateEmailSuporte = (userEmail, imageLinks, mensagem) => {
  const email = {
    body: {
      name: userEmail,
      greeting: "Olá",
      signature: "Atenciosamente",
      intro: "Você recebeu uma mensagem de suporte.",
      table: {
        data: [
          {
            item: "Mensagem",
            description: mensagem,
          },
          {
            item: "Links de Imagem",
            description: imageLinks,
          },
        ],
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: "20%",
            description: "80%",
          },
          // Optionally, change column text alignment
          customAlignment: {
            item: "left",
            description: "right",
          },
        },
      },
      outro:
        "Se precisar de ajuda, entre em contato conosco pelo e-mail: contatocestaviva@gmail.com.",
    },
  };

  return {
    emailBody: mailGenerator.generate(email), // Gera o e-mail em HTML
    emailText: mailGenerator.generatePlaintext(email), // Gera versão em texto puro
  };
};