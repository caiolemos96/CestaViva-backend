import mongoose from "mongoose";

const entidadeSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    razaoSocial: { type: String },
    cidade: { type: String },
    estado: { type: String },
    endereco: { type: String },
    numero: { type: Number },
    bairro: { type: String },
    cep: { type: Number },
  },
  { versionKey: false }
);

const entidade = mongoose.model("entidades", entidadeSchema); //colecao referente ao banco e schema

export default entidade;
