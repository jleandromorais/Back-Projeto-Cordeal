// controllers/dashboardController.js
const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Obter Métricas (Simulado por enquanto)
const getMetrics = async (req, res) => {
  try {
    // Aqui no futuro podes ler de uma coleção "respostas"
    // Por enquanto, enviamos valores zerados ou estáticos
    res.json({
      questoesRespondidas: 12,
      horasDedicadas: 5
    });
  } catch (error) {
    console.error("Erro ao buscar métricas:", error);
    res.status(500).send('Erro ao buscar métricas');
  }
};

// 2. Obter Notas do Utilizador
const getNotes = async (req, res) => {
  const userId = req.user.uid;
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists && doc.data().notes) {
      res.json({ content: doc.data().notes });
    } else {
      res.json({ content: '' }); // Se não houver notas, devolve vazio
    }
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    res.status(500).send('Erro ao buscar notas');
  }
};

// 3. Salvar Notas do Utilizador
const saveNotes = async (req, res) => {
  const userId = req.user.uid;
  const { content } = req.body;

  try {
    // Guarda a nota dentro do documento do utilizador
    await db.collection('users').doc(userId).set({
      notes: content
    }, { merge: true }); // "merge: true" para não apagar o resto dos dados (nome, etc)

    res.status(200).send('Notas salvas');
  } catch (error) {
    console.error("Erro ao salvar notas:", error);
    res.status(500).send('Erro ao salvar notas');
  }
};

module.exports = { getMetrics, getNotes, saveNotes };