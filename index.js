const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin'); // 1. Importe o Firebase Admin

// 2. Carregue a sua Chave de Conta de Serviço
// (Lembre-se de baixar este ficheiro do Firebase Console e colocá-lo na mesma pasta)
const serviceAccount = require('./serviceAccountKey.json');

// 3. Inicialize o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Inicialize o Firestore
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json()); // Importante para ler o body das requisições POST/PUT

// =================================================================
// ARQUIVO 2: O Middleware de Autenticação (O "Porteiro")
// =================================================================
async function checkAuth(req, res, next) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized: Nenhum token fornecido');
  }

  // Pega o token "Bearer <token>"
  const idToken = req.headers.authorization.split('Bearer ')[1];

  try {
    // Verifica se o token é válido usando o Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Anexa os dados do utilizador (como o UID) à requisição
    // para que as próximas rotas possam usá-los
    req.user = decodedToken;
    next(); // Se o token for válido, continua para a rota
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(403).send('Unauthorized: Token inválido');
  }
}

// =================================================================
// ARQUIVO 3: As Rotas da API (Endpoints)
// =================================================================

// Rota de teste antiga (pode manter ou apagar)
app.get('/', (req, res) => {
  res.send('Backend do Cordeal está a funcionar!');
});

// --- NOVAS ROTAS PARA O DASHBOARD ---

// Rota para buscar os dados do utilizador (para o "Olá, Alessandra")
// Note o "checkAuth" - esta rota agora está protegida
app.get('/api/user/me', checkAuth, async (req, res) => {
  try {
    // Graças ao middleware, o req.user já tem o UID do utilizador
    const userId = req.user.uid;
    
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send('Utilizador não encontrado no Firestore');
    }

    // Retorna os dados do utilizador (ex: nome, curso, etc.)
    res.json(userDoc.data());
    
  } catch (error) {
    console.error("Erro ao buscar dados do utilizador:", error);
    res.status(500).send('Erro interno ao buscar dados do utilizador');
  }
});

// Rota para buscar as métricas
app.get('/api/dashboard/metrics', checkAuth, async (req, res) => {
  // No futuro, você buscaria isto do banco de dados
  // Por agora, vamos simular:
  res.json({
    questoesRespondidas: 23,
    horasDedicadas: 7
    // pode adicionar mais métricas aqui
  });
});

// Rota para buscar os eventos do calendário
app.get('/api/calendar/events', checkAuth, async (req, res) => {
  const userId = req.user.uid;
  // No futuro, você buscaria de uma sub-coleção 'events' do utilizador
  // const snapshot = await db.collection('users').doc(userId).collection('events').get();
  
  // Por agora, vamos simular os dados que o seu frontend espera:
  res.json({
    "2025-08-24": { // O seu código usa a data como chave
      title: "Prova",
      prof: "Prof.: João Neves",
      time: "19:00 às 22:00",
      subject: "Matemática para computação"
    }
  });
});

// Rota para SALVAR um evento
app.post('/api/calendar/events', checkAuth, async (req, res) => {
    const userId = req.user.uid;
    const { dateKey, eventData } = req.body; // Espera um body como { dateKey: "2025-08-25", eventData: {...} }

    if (!dateKey || !eventData) {
        return res.status(400).send('Dados do evento incompletos');
    }

    try {
        // Lógica para salvar o evento no Firestore
        // Ex: await db.collection('users').doc(userId).collection('events').doc(dateKey).set(eventData);
        console.log('Salvando evento para:', userId, 'em', dateKey);
        res.status(201).json({ message: 'Evento salvo com sucesso' });
    } catch (error) {
        console.error("Erro ao salvar evento:", error);
        res.status(500).send('Erro ao salvar evento');
    }
});

// (Pode adicionar rotas para DELETAR eventos e para as ANOTAÇÕES)

// =================================================================

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend a rodar na porta ${port}`);
});