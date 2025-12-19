const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Obter Métricas
const getMetrics = async (req, res) => {
  try {
    // Retorna dados fictícios por enquanto
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
  try {
    // CORREÇÃO CRÍTICA: Verifica se req.userData existe antes de usar
    if (!req.userData || !req.userData.uid) {
      console.error("Erro: Dados do utilizador não encontrados no pedido.");
      return res.status(401).json({ message: 'Utilizador não identificado.' });
    }

    // AQUI ESTAVA O ERRO: Mudámos de req.user para req.userData
    const userId = req.userData.uid; 
    
    const doc = await db.collection('users').doc(userId).get();
    
    if (doc.exists && doc.data().notes) {
      res.json({ content: doc.data().notes });
    } else {
      res.json({ content: '' });
    }
  } catch (error) {
    console.error("Erro ao buscar notas:", error);
    res.status(500).send('Erro ao buscar notas');
  }
};

// 3. Salvar Notas do Utilizador
const saveNotes = async (req, res) => {
  try {
    // CORREÇÃO CRÍTICA: Verifica se req.userData existe
    if (!req.userData || !req.userData.uid) {
      return res.status(401).json({ message: 'Utilizador não identificado.' });
    }

    // AQUI TAMBÉM: Mudámos de req.user para req.userData
    const userId = req.userData.uid;
    const { content } = req.body;

    await db.collection('users').doc(userId).set({
      notes: content
    }, { merge: true });

    res.status(200).send('Notas salvas');
  } catch (error) {
    console.error("Erro ao salvar notas:", error);
    res.status(500).send('Erro ao salvar notas');
  }
};

module.exports = { getMetrics, getNotes, saveNotes };