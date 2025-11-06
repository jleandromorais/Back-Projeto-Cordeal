// O controlador precisa de aceder à base de dados
const admin = require('firebase-admin');
const db = admin.firestore();

// 1. Lógica para BUSCAR eventos
const getAllEvents = async (req, res) => {
  const userId = req.user.uid;
  try {
    const eventsSnapshot = await db.collection('users').doc(userId).collection('events').get();
    const events = {};
    eventsSnapshot.forEach(doc => {
      events[doc.id] = doc.data();
    });
    res.json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).send('Erro ao buscar eventos');
  }
};

// 2. Lógica para SALVAR um evento
const saveEvent = async (req, res) => {
  const userId = req.user.uid;
  const { dateKey, eventData } = req.body;

  if (!dateKey || !eventData) {
    return res.status(400).send('Dados do evento incompletos');
  }

  try {
    await db.collection('users').doc(userId).collection('events').doc(dateKey).set(eventData);
    console.log('Evento salvo para:', userId, 'em', dateKey);
    res.status(201).json({ message: 'Evento salvo com sucesso' });
  } catch (error) {
    console.error("Erro ao salvar evento:", error);
    res.status(500).send('Erro ao salvar evento');
  }
};

// 3. Lógica para DELETAR um evento
const deleteEvent = async (req, res) => {
  const userId = req.user.uid;
  const { dateKey } = req.params;

  if (!dateKey) {
    return res.status(400).send('Data do evento não fornecida');
  }

  try {
    await db.collection('users').doc(userId).collection('events').doc(dateKey).delete();
    console.log('Evento deletado para:', userId, 'em', dateKey);
    res.status(200).json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    res.status(500).send('Erro ao deletar evento');
  }
};

// Exportamos todas as funções
module.exports = {
  getAllEvents,
  saveEvent,
  deleteEvent
};