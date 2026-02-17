const admin = require('firebase-admin');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // MUDANÇA: Se não tiver token, BLOQUEIA logo aqui.
    if (!authHeader) {
       console.log("Bloqueio: Tentativa de acesso sem token.");
       return res.status(401).json({ message: 'Token não fornecido!' });
    }

    // Valida formato "Bearer TOKEN"
    if (!authHeader.startsWith('Bearer ')) {
       console.log("Bloqueio: Formato de token inválido.");
       return res.status(401).json({ message: 'Formato de autenticação inválido. Use: Bearer TOKEN' });
    }

    const token = authHeader.split(' ')[1];
    
    // Valida se o token não está vazio após o split
    if (!token || token.trim() === '') {
       console.log("Bloqueio: Token vazio após Bearer.");
       return res.status(401).json({ message: 'Token não fornecido!' });
    }

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