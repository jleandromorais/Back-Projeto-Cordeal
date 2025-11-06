// Crie este novo ficheiro: controllers/userController.js

const admin = require('firebase-admin');
const db = admin.firestore();

const getUserData = async (req, res) => {
  // O 'req.user.uid' vem do seu middleware 'checkAuth'
  const userId = req.user.uid; 

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(404).send('Dados do usuário não encontrados.');
    }

    // Envia todos os dados do utilizador (incluindo o 'nome')
    res.json(userDoc.data());

  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    res.status(500).send('Erro ao buscar dados do usuário');
  }
};

module.exports = {
  getUserData
};