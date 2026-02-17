// index.js (Com o Chat incluído e Correção do Firebase)
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
// Importante: Adicionar isto para ler o ficheiro .env onde vais por a chave
require('dotenv').config(); 

// --- CORREÇÃO AQUI ---
// Verifica se há uma variável de ambiente com as credenciais (para o Render)
// Se não houver, tenta ler o ficheiro local (para o teu PC)
let serviceAccount;

try {
  if (process.env.FIREBASE_CREDENTIALS) {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
    console.log("✅ Firebase configurado via variável de ambiente FIREBASE_CREDENTIALS");
  } else {
    serviceAccount = require('./serviceAccountKey.json');
    console.log("✅ Firebase configurado via arquivo serviceAccountKey.json");
  }
} catch (error) {
  console.error("❌ ERRO CRÍTICO: Não foi possível carregar as credenciais do Firebase!");
  console.error("Verifique se:");
  console.error("1. O arquivo serviceAccountKey.json existe na raiz do projeto, OU");
  console.error("2. A variável de ambiente FIREBASE_CREDENTIALS está configurada corretamente");
  console.error("Detalhes do erro:", error.message);
  process.exit(1); // Encerra o servidor se não conseguir configurar o Firebase
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. IMPORTAR AS ROTAS ---
const calendarRoutes = require('./routes/calendarRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const chatRoutes = require('./routes/chatRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// --- 2. USAR AS ROTAS ---
app.use('/api/calendar', calendarRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
  res.send('Backend do Cordeal está a funcionar!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend a rodar na porta ${port}`);
});