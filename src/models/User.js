import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nome: { type: String },
    email: { type: String },
    senha: { type: String },
  },
  { versionKey: false }
);

const User = mongoose.model("users", userSchema); //colecao referente ao banco e schema

export default User;
