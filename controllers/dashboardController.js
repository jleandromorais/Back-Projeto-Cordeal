const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Obter Métricas (Lê do Firestore)
const getMetrics = async (req, res) => {
  try {
    const userId = req.userData.uid;
    const userDoc = await db.collection('users').doc(userId).get();

    // Valores padrão (Zero) se o utilizador for novo
    let data = {
      stats: {
        questoesRespondidas: 0,
        questoesCertas: 0,
        horasDedicadas: 0,
        atividadesFeitas: 0,
        diasDedicados: 0
      },
      modules: {} // Guardar o progresso de cada módulo aqui
    };

    if (userDoc.exists) {
      const docData = userDoc.data();
      // Mescla os dados existentes com a estrutura padrão para evitar erros
      if (docData.stats) data.stats = { ...data.stats, ...docData.stats };
      if (docData.modules) data.modules = docData.modules;
    }

    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    res.status(500).json({ message: 'Erro ao buscar métricas' });
  }
};

// 2. Salvar Progresso da Atividade (NOVO)
const saveActivityProgress = async (req, res) => {
  try {
    const userId = req.userData.uid;
    const { moduleId, correct, total, timeSpent } = req.body; 
    // timeSpent em horas ou minutos, como preferires. Vamos assumir que vem algo para somar.

    const userRef = db.collection('users').doc(userId);

    await db.runTransaction(async (t) => {
      const doc = await t.get(userRef);
      let newStats = {
        questoesRespondidas: 0,
        questoesCertas: 0,
        horasDedicadas: 0,
        atividadesFeitas: 0,
        diasDedicados: 1 // Começa com 1 dia se for novo
      };
      let modules = {};

      if (doc.exists) {
        const data = doc.data();
        if (data.stats) newStats = { ...newStats, ...data.stats };
        if (data.modules) modules = data.modules;
      }

      // Atualiza estatísticas globais
      newStats.questoesRespondidas += total;
      newStats.questoesCertas += correct;
      if (timeSpent) newStats.horasDedicadas += timeSpent;
      
      // Verifica se este módulo já tinha sido feito antes para não contar "Atividade Feita" duplicada
      // ou conta sempre que ele termina uma tentativa. Vamos contar sempre por enquanto:
      newStats.atividadesFeitas += 1;

      // Atualiza o módulo específico (Ex: Módulo 1)
      modules[moduleId] = {
        completed: true,
        correct: correct,
        total: total,
        lastDate: new Date().toISOString()
      };

      t.set(userRef, { stats: newStats, modules: modules }, { merge: true });
    });

    res.json({ message: "Progresso salvo com sucesso!" });
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    res.status(500).json({ message: "Erro ao salvar progresso" });
  }
};

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
    // ... (O teu código existente do saveNotes) ...
    try {
        const userId = req.userData.uid;
        const { content } = req.body;
        await db.collection('users').doc(userId).set({ notes: content }, { merge: true });
        res.status(200).send('Notas salvas');
    } catch (error) {
        res.status(500).send('Erro');
    }
};

module.exports = { getMetrics, saveActivityProgress, getNotes, saveNotes };