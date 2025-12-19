const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // MUDANÇA: Se não tiver token, BLOQUEIA logo aqui.
    if (!authHeader) {
       console.log("Bloqueio: Tentativa de acesso sem token.");
       return res.status(401).json({ message: 'Token não fornecido!' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Guarda na gaveta correta
    req.userData = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.displayName,
        picture: decodedToken.picture
    };
    
    next();
  } catch (error) {
    console.log("Erro de Auth:", error);
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }
};