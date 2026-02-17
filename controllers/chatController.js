// controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// --- CONFIGURAÇÃO DA IA ---
const apiKey = process.env.GEMINI_API_KEY;
let model = null;

if (!apiKey) {
    console.error("⚠️ AVISO: GEMINI_API_KEY não encontrada no ficheiro .env");
} else {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // ✅ SOLUÇÃO: 'gemini-flash-latest' usa a versão estável e gratuita disponível
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        console.log("✅ Modelo Gemini (Latest) configurado com sucesso.");
    } catch (err) {
        console.error("❌ Erro ao inicializar o Gemini:", err.message);
    }
}

// --- CONTROLADOR ---
exports.sendMessage = async (req, res) => {
  try {
    console.log("--- INÍCIO DO PEDIDO DE CHAT ---");

    if (!model) {
        return res.status(500).json({ 
            error: "O sistema de IA não está ativo." 
        });
    }

    const { message } = req.body;
    
    // Validação robusta
    if (!message) {
      return res.status(400).json({ error: "A mensagem não pode estar vazia." });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({ error: "A mensagem deve ser uma string." });
    }

    if (message.trim() === '') {
      return res.status(400).json({ error: "A mensagem não pode conter apenas espaços." });
    }

    // Limite de tamanho (10KB)
    if (message.length > 10 * 1024) {
      return res.status(400).json({ error: "Mensagem muito longa (máximo 10KB)." });
    }

    console.log(`📩 Recebido: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"`);
    console.log("🤖 A pensar...");

    // Enviar para a IA
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log("✅ Resposta gerada!");
    
    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("❌ ERRO NO PROCESSO DE CHAT:", error);
    
    // Se der erro de cota (429), avisamos o front-end de forma amigável
    if (error.status === 429) {
        return res.status(429).json({ 
            error: "Limite de uso da IA atingido. Tenta novamente daqui a pouco." 
        });
    }

    return res.status(500).json({ 
        error: "Erro ao comunicar com a IA.", 
        details: error.message 
    });
  }
};