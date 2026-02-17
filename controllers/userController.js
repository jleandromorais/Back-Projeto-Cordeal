const admin = require('firebase-admin');
const db = admin.firestore();

// --- 1. Buscar Perfil ---
exports.getUser = async (req, res) => {
  try {
    const userData = req.userData;
    let finalName = userData.name;

    if (!finalName) {
        const userDoc = await db.collection('users').doc(userData.uid).get();
        if (userDoc.exists) {
            const dados = userDoc.data();
            finalName = dados.nome || dados.name;
        }
    }

    const user = {
      name: finalName || "Utilizador", 
      email: userData.email,
      avatar: userData.picture || "https://github.com/jleandromorais.png"
    };
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro getUser:", error);
    res.status(500).json({ message: "Erro ao buscar perfil." });
  }
};

// --- 2. Salvar Resultado do Quiz ---
exports.saveQuizResult = async (req, res) => {
  try {
    const userData = req.userData;
    const { moduleId, correctCount, totalQuestions, score } = req.body;

    // Validação robusta dos dados de entrada
    if (!moduleId) {
      return res.status(400).json({ message: "ID do módulo é obrigatório." });
    }

    if (correctCount === undefined || correctCount === null) {
      return res.status(400).json({ message: "Número de questões corretas é obrigatório." });
    }

    if (totalQuestions === undefined || totalQuestions === null) {
      return res.status(400).json({ message: "Total de questões é obrigatório." });
    }

    // Validações de tipo e valores
    if (!Number.isInteger(correctCount) || correctCount < 0) {
      return res.status(400).json({ message: "Número de questões corretas inválido." });
    }

    if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) {
      return res.status(400).json({ message: "Total de questões inválido." });
    }

    if (correctCount > totalQuestions) {
      return res.status(400).json({ message: "Número de questões corretas não pode ser maior que o total." });
    }

    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 100)) {
      return res.status(400).json({ message: "Score inválido (deve ser entre 0 e 100)." });
    }

    console.log(`💾 Salvando quiz user: ${userData.uid} | Módulo: ${moduleId}`);

    // Salva na sub-coleção 'activities'
    // O ID do documento é o moduleId ('1', '2'...) para garantir unicidade por módulo
    await db.collection('users').doc(userData.uid).collection('activities').doc(moduleId).set({
      moduleId: moduleId,
      correctCount: correctCount,
      totalQuestions: totalQuestions,
      score: score || Math.round((correctCount / totalQuestions) * 100),
      completedAt: new Date(),
      type: 'quiz'
    }, { merge: true });

    res.status(200).json({ message: "Sucesso!" });

  } catch (error) {
    console.error("Erro saveQuiz:", error);
    res.status(500).json({ message: "Erro ao salvar." });
  }
};

// --- 3. Buscar Estatísticas (O Coração da Interligação) ---
exports.getUserStats = async (req, res) => {
  try {
    const userData = req.userData;
    
    // Busca todas as atividades que o utilizador já fez
    const snapshot = await db.collection('users').doc(userData.uid).collection('activities').get();

    // Valores iniciais (ZERADOS)
    let stats = {
        completedActivities: 0,
        totalActivities: 15, // Meta do curso
        correctQuestions: 0,
        totalQuestions: 0,   // Respondidas
        hours: "0H",
        days: 0,
        completedModules: [] // Lista de IDs: ['1', '3']
    };

    if (snapshot.empty) {
        // Se não tem atividades, retorna tudo zero
        return res.status(200).json(stats);
    }

    let diasSet = new Set();
    let totalAtividades = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalAtividades++;
      stats.correctQuestions += (data.correctCount || 0);
      stats.totalQuestions += (data.totalQuestions || 0);
      
      // Adiciona à lista de concluídos para a página de Atividades saber
      if (data.moduleId) {
          stats.completedModules.push(data.moduleId.toString());
      }
      
      // Conta dias únicos
      if (data.completedAt) {
         const d = data.completedAt.toDate ? data.completedAt.toDate() : new Date(data.completedAt);
         diasSet.add(d.toDateString());
      }
    });

    stats.completedActivities = totalAtividades;
    stats.days = diasSet.size;
    
    // Estimativa: 15 min (0.25h) por atividade
    const horas = Math.round(totalAtividades * 0.25);
    stats.hours = `${horas}H`;

    res.status(200).json(stats);

  } catch (error) {
    console.error("Erro Stats:", error);
    res.status(500).json({ message: "Erro ao buscar estatísticas." });
  }
};