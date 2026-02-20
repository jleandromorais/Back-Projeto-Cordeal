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

    // Prompt de sistema para focar em matemática
    const systemPrompt = `Você é o Neves, um assistente virtual especializado em matemática e matemática para computação. 

REGRAS IMPORTANTES:
1. Você DEVE responder APENAS sobre tópicos de matemática, matemática para computação, lógica, algoritmos e áreas relacionadas.
2. Se o usuário perguntar sobre outros assuntos (política, entretenimento, receitas, etc.), responda educadamente: "Desculpe, sou especializado em matemática e matemática para computação. Posso ajudar com dúvidas sobre esses temas! 😊"
3. Seja didático, claro e paciente nas explicações.
4. Use exemplos práticos quando possível.
5. Se o usuário tiver dificuldade, explique de forma mais simples.
6. Incentive o aluno a continuar aprendendo.

TÓPICOS QUE VOCÊ PODE AJUDAR:
- Álgebra, Cálculo, Geometria, Trigonometria
- Lógica Matemática, Teoria dos Conjuntos
- Matemática Discreta
- Algoritmos e Estruturas de Dados
- Teoria dos Números
- Probabilidade e Estatística
- Análise Combinatória
- Funções, Limites, Derivadas, Integrais
- Sistemas Lineares, Matrizes

Agora responda à seguinte pergunta do aluno:

`;

    // Enviar para a IA com o prompt de sistema
    const fullPrompt = systemPrompt + message;
    const result = await model.generateContent(fullPrompt);
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