import mongoose from "mongoose";

const cestaModeloSchema = new mongoose.Schema(
  {
    nomeProduto: { type: String, required: true },
    quantidadeProduto: { type: String, required: true, unique: true },
    unidadeMedida: { type: String, required: true },
    nomeCampanha: { type: String, required: true },
    comecaEm: { type: String, required: true },
    terminaEm: { type: String, required: true },
  },
  { versionKey: false }
);

const cesta = mongoose.model("cestas", cestaModeloSchema); //colecao referente ao banco e schema

export default cesta;