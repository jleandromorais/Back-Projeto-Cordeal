// 1. Importar o módulo do Express
const express = require('express');

// 2. Inicializar o aplicativo Express
const app = express();

// 3. Definir a porta do servidor
// Usamos a porta 3000 como padrão
const PORT = process.env.PORT || 3000;

// 4. Criar a rota principal (/)
// Quando alguém acessar a raiz do site (ex: http://localhost:3000/)
app.get('/', (req, res) => {
  // req = Requisição (Request) - O que o cliente envia
  // res = Resposta (Response) - O que o servidor devolve

  res.send('Olá, mundo! Meu back-end Node.js está funcionando!');
});

// 5. Iniciar o servidor para "ouvir" na porta definida
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});