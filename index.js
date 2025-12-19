// index.js (Com o Chat incluído)
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
// Importante: Adicionar isto para ler o ficheiro .env onde vais por a chave
require('dotenv').config(); 

const serviceAccount = require('./serviceAccountKey.json');
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
// [NOVO] Importar a rota do Chat
const chatRoutes = require('./routes/chatRoutes'); 

// --- 2. USAR AS ROTAS ---
app.use('/api/calendar', calendarRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
// [NOVO] Usar a rota do Chat
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('Backend do Cordeal está a funcionar!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend a rodar na porta ${port}`);
});