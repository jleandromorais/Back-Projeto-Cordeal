const admin = require('firebase-admin');
const db = admin.firestore();

// Função para listar eventos (GET)
exports.getEvents = async (req, res) => {
  try {
    const userId = req.userData.uid;
    
    // Busca os eventos do usuário no Firestore
    const eventsSnapshot = await db.collection('users').doc(userId).collection('events').orderBy('date', 'asc').get();

    const events = [];
    
    eventsSnapshot.forEach(doc => {
      const data = doc.data();
      events.push({
        id: doc.id,
        date: data.date,
        title: data.title,
        description: data.description || '',
        createdAt: data.createdAt || null
      });
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
};

// Função para criar evento (POST)
exports.createEvent = async (req, res) => {
  try {
    const userId = req.userData.uid;
    const { date, title, description } = req.body;

    // Validação básica
    if (!date || !title) {
      return res.status(400).json({ message: "Data e título são obrigatórios!" });
    }

    // Validação de formato de data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: "Formato de data inválido. Use: YYYY-MM-DD" });
    }

    const novoEvento = {
      date,
      title: title.trim(),
      description: description ? description.trim() : '',
      createdAt: new Date()
    };

    // Salva no Firestore
    const docRef = await db.collection('users').doc(userId).collection('events').add(novoEvento);

    console.log("✅ Novo evento criado:", docRef.id);
    
    res.status(201).json({ 
      message: "Evento criado com sucesso!", 
      event: { id: docRef.id, ...novoEvento } 
    });
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    res.status(500).json({ message: "Erro ao criar evento" });
  }
};