// teste-modelos.js
require('dotenv').config();

async function listarModelos() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.log("❌ Sem chave no .env");
        return;
    }

    console.log("🔍 A perguntar ao Google quais modelos tens disponíveis...");
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ Erro da API:", data.error.message);
        } else {
            console.log("\n✅ MODELOS DISPONÍVEIS PARA A TUA CHAVE:");
            // Filtra apenas os que servem para gerar conteúdo (generateContent)
            const modelosUteis = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
            
            modelosUteis.forEach(m => {
                console.log(`- ${m.name.replace('models/', '')}`); // Remove o prefixo 'models/'
            });
            console.log("\n👉 Copia um dos nomes acima e coloca no teu chatController.js");
        }
    } catch (error) {
        console.error("❌ Erro de conexão:", error);
    }
}

listarModelos();