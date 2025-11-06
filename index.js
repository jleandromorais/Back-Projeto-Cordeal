const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- INICIALIZAÇÃO (Isto fica aqui) ---
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

// --- ROTAS (A grande mudança) ---

// 1. Importamos os nossos ficheiros de rotas
const calendarRoutes = require('./routes/calendarRoutes');
const userRoutes = require('./routes/userRoutes'); // <-- LINHA ATUALIZADA

// 2. Dizemos ao Express para USAR essas rotas
// Todos os URLs em 'calendarRoutes' agora começarão com /api/calendar
app.use('/api/calendar', calendarRoutes);

// Todos os URLs em 'userRoutes' começarão com /api/user
app.use('/api/user', userRoutes); // <-- LINHA ATUALIZADA

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend do Cordeal está a funcionar!');
});

// --- INICIAR SERVIDOR ---
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend a rodar na porta ${port}`);
});