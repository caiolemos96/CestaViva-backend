import express from "express";
import { uploadToImgur } from "../controllers/imgurController.js"; // Adicione a extensão .js

const routes = express.Router();

routes.post("/upload", uploadToImgur);

export default routes;