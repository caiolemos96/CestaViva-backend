import axios from "axios";
import FormData from "form-data";

export const uploadToImgur = async (req, res) => {
  try {
    const { image } = req.body; // Recebe a imagem como Base64 ou URL
    if (!image) {
      return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

    const clientId = process.env.IMGUR_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ error: "Client ID do Imgur não configurado" });
    }

    const data = new FormData();
    data.append("image", image);

    const response = await axios.post("https://api.imgur.com/3/image", data, {
      headers: {
        Authorization: `Client-ID ${clientId}`,
        ...data.getHeaders(),
      },
    });

    return res.json({ link: response.data.data.link }); // Retorna o link da imagem
  } catch (error) {
    return res.status(500).json({ error: "Erro ao fazer upload", details: error.message });
  }
};