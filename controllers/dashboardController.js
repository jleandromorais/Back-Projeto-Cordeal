const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Obter Métricas (Lê do Firestore)
const getMetrics = async (req, res) => {
  try {
    const userId = req.userData.uid;

    // Busca as atividades concluídas da sub-collection 'activities'
    const activitiesSnapshot = await db.collection('users').doc(userId).collection('activities').get();

    // Valores padrão (Zero) se o utilizador for novo
    let stats = {
      questoesRespondidas: 0,
      questoesCertas: 0,
      horasDedicadas: 0,
      atividadesFeitas: 0,
      diasDedicados: 0
    };

    let modules = {}; // Guardar o progresso de cada módulo aqui
    let diasSet = new Set();

    // Processa as atividades da sub-collection
    if (!activitiesSnapshot.empty) {
      activitiesSnapshot.forEach(doc => {
        const data = doc.data();
        
        // Atualiza estatísticas globais
        stats.questoesRespondidas += (data.totalQuestions || 0);
        stats.questoesCertas += (data.correctCount || 0);
        stats.atividadesFeitas++;
        
        // Estima horas (15 min = 0.25h por atividade)
        stats.horasDedicadas += 0.25;

        // Adiciona o módulo aos concluídos
        if (data.moduleId) {
          modules[data.moduleId] = {
            completed: true,
            correct: data.correctCount || 0,
            total: data.totalQuestions || 0,
            lastDate: data.completedAt ? (data.completedAt.toDate ? data.completedAt.toDate().toISOString() : new Date(data.completedAt).toISOString()) : new Date().toISOString()
          };
        }

        // Conta dias únicos
        if (data.completedAt) {
          const d = data.completedAt.toDate ? data.completedAt.toDate() : new Date(data.completedAt);
          diasSet.add(d.toDateString());
        }
      });

      stats.diasDedicados = diasSet.size;
      stats.horasDedicadas = Math.round(stats.horasDedicadas * 10) / 10; // Arredonda para 1 casa decimal
    }

    res.json({ stats, modules });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    res.status(500).json({ message: 'Erro ao buscar métricas' });
  }
};

// 2. Salvar Progresso da Atividade (REMOVIDO - FUNCIONALIDADE DUPLICADA)
// NOTA: Esta função está duplicada com userController.saveQuizResult
// Para evitar inconsistências, use apenas /api/user/save-quiz

// 3. Obter Notas (Mantém-se igual, só certifica-te que está aqui)
const getNotes = async (req, res) => {
    // ... (O teu código existente do getNotes) ...
    // Vou resumir para não ocupar espaço, mantém o que tinhas
    try {
        const userId = req.userData.uid;
        const doc = await db.collection('users').doc(userId).get();
        if (doc.exists && doc.data().notes) {
            res.json({ content: doc.data().notes });
        } else {
            res.json({ content: '' });
        }
    } catch (error) {
        res.status(500).send('Erro');
    }
};

// 4. Salvar Notas (Mantém-se igual)
const saveNotes = async (req, res) => {
    try {
        const userId = req.userData.uid;
        const { content } = req.body;

        // Validação
        if (content === undefined || content === null) {
            return res.status(400).json({ message: "Conteúdo das notas é obrigatório." });
        }

        if (typeof content !== 'string') {
            return res.status(400).json({ message: "Conteúdo deve ser uma string." });
        }

        // Limite de tamanho (10MB)
        if (content.length > 10 * 1024 * 1024) {
            return res.status(400).json({ message: "Conteúdo muito grande (máximo 10MB)." });
        }

        await db.collection('users').doc(userId).set({ notes: content }, { merge: true });
        res.status(200).json({ message: 'Notas salvas com sucesso!' });
    } catch (error) {
        console.error("Erro ao salvar notas:", error);
        res.status(500).json({ message: 'Erro ao salvar notas' });
    }
};

module.exports = { getMetrics, getNotes, saveNotes };