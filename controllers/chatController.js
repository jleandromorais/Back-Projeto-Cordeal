const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Configura o Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    // Escolhe o modelo (o gemini-pro é ótimo para texto)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Envia a mensagem e espera a resposta
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Erro no Gemini:", error);
    res.status(500).json({ error: "Erro ao falar com a IA." });
  }
};