const admin = require('firebase-admin');

// Esta é a mesma função que você já tinha
async function checkAuth(req, res, next) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    return res.status(403).send('Unauthorized: Nenhum token fornecido');
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(403).send('Unauthorized: Token inválido');
  }
}

// Exportamos a função para que outros ficheiros possam usá-la
module.exports = {
  checkAuth
};