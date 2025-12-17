// index.js (Versão Final Corrigida)
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

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
// ESTA É A QUE FALTA NO TEU ARQUIVO:
const dashboardRoutes = require('./routes/dashboardRoutes'); 

// --- 2. USAR AS ROTAS ---
app.use('/api/calendar', calendarRoutes);
app.use('/api/user', userRoutes);
// ESTA TAMBÉM FALTA:
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Backend do Cordeal está a funcionar!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend a rodar na porta ${port}`);
});