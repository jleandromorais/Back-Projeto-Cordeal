const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Criar Feedback
const createFeedback = async (req, res) => {
  try {
    const userId = req.userData.uid;
    const { message, rating, category } = req.body;

    // Validações
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Mensagem é obrigatória.' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Avaliação deve ser entre 1 e 5.' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Categoria é obrigatória.' });
    }

    // Limites
    if (message.length > 1000) {
      return res.status(400).json({ message: 'Mensagem muito longa (máximo 1000 caracteres).' });
    }

    const validCategories = ['geral', 'bug', 'sugestao', 'conteudo', 'usabilidade'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Categoria inválida.' });
    }

    // Cria o feedback
    const feedbackData = {
      userId,
      userEmail: req.userData.email,
      userName: req.userData.name || 'Utilizador',
      message: message.trim(),
      rating: parseInt(rating),
      category,
      createdAt: new Date(),
      status: 'pending' // pending, reviewed, resolved
    };

    const docRef = await db.collection('feedbacks').add(feedbackData);

    console.log(`✅ Feedback criado: ${docRef.id} por ${req.userData.email}`);

    res.status(201).json({
      message: 'Feedback enviado com sucesso!',
      feedback: {
        id: docRef.id,
        ...feedbackData,
        createdAt: feedbackData.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Erro ao criar feedback:', error);
    res.status(500).json({ message: 'Erro ao enviar feedback.' });
  }
};

// 2. Listar Feedbacks do Usuário
const getUserFeedbacks = async (req, res) => {
  try {
    const userId = req.userData.uid;

    const snapshot = await db.collection('feedbacks')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const feedbacks = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      feedbacks.push({
        id: doc.id,
        message: data.message,
        rating: data.rating,
        category: data.category,
        createdAt: data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        status: data.status || 'pending'
      });
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar feedbacks:', error);
    res.status(500).json({ message: 'Erro ao buscar feedbacks.' });
  }
};

// 3. [ADMIN] Listar TODOS os Feedbacks (opcional - para painel admin)
const getAllFeedbacks = async (req, res) => {
  try {
    // Você pode adicionar verificação de admin aqui
    const { status, category, limit = 50 } = req.query;

    let query = db.collection('feedbacks');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    query = query.orderBy('createdAt', 'desc').limit(parseInt(limit));

    const snapshot = await query.get();

    const feedbacks = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      feedbacks.push({
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName,
        message: data.message,
        rating: data.rating,
        category: data.category,
        createdAt: data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        status: data.status || 'pending'
      });
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Erro ao buscar todos os feedbacks:', error);
    res.status(500).json({ message: 'Erro ao buscar feedbacks.' });
  }
};

// 4. [ADMIN] Atualizar Status do Feedback
const updateFeedbackStatus = async (req, res) => {
  try {
    // Você pode adicionar verificação de admin aqui
    const { feedbackId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewed', 'resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Status inválido.' });
    }

    await db.collection('feedbacks').doc(feedbackId).update({
      status,
      updatedAt: new Date()
    });

    res.status(200).json({ message: 'Status atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ message: 'Erro ao atualizar status.' });
  }
};

module.exports = {
  createFeedback,
  getUserFeedbacks,
  getAllFeedbacks,
  updateFeedbackStatus
};
