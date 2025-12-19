const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Configura o Gemini com a tua chave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    // --- CORREÇÃO AQUI ---
    // Trocámos "gemini-pro" (que dá erro 404) por "gemini-1.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Envia a mensagem e espera a resposta
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error("Erro no Gemini:", error);
    // Se der erro, enviamos isto para saberes o que aconteceu no terminal
    res.status(500).json({ error: "Erro ao falar com a IA." });
  }
};