const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Obter Métricas
const getMetrics = async (req, res) => {
  res.json({ questoesRespondidas: 12, horasDedicadas: 5 });
};

// 2. Obter Notas
const getNotes = async (req, res) => {
  console.log("🔥 Tentando buscar notas..."); // Log para debug

  try {
    // BLINDAGEM: Se não houver dados, pára aqui em vez de crashar.
    if (!req.userData || !req.userData.uid) {
      console.log("❌ Falha: Sem userData!");
      return res.status(401).json({ message: 'Utilizador não identificado.' });
    }

    const userId = req.userData.uid; // Agora é seguro ler
    console.log("✅ Sucesso: UserID é", userId);

    const doc = await db.collection('users').doc(userId).get();
    
    if (doc.exists && doc.data().notes) {
      res.json({ content: doc.data().notes });
    } else {
      res.json({ content: '' });
    }
  } catch (error) {
    console.error("☠️ Erro Fatal:", error);
    res.status(500).send('Erro ao buscar notas');
  }
};

// 3. Salvar Notas
const saveNotes = async (req, res) => {
  try {
    if (!req.userData || !req.userData.uid) {
      return res.status(401).json({ message: 'Utilizador não identificado.' });
    }

    const userId = req.userData.uid;
    const { content } = req.body;

    await db.collection('users').doc(userId).set({ notes: content }, { merge: true });
    res.status(200).send('Notas salvas');
  } catch (error) {
    res.status(500).send('Erro ao salvar notas');
  }
};

module.exports = { getMetrics, getNotes, saveNotes };