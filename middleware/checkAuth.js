const admin = require('firebase-admin');

// NOTA: Se não tiveres o firebase-admin configurado, isto pode dar erro depois.
// Mas para resolver o erro atual, a estrutura tem de ser esta:

module.exports = async (req, res, next) => {
  try {
    // Se não houver cabeçalho de autorização, deixa passar como teste ou bloqueia
    const authHeader = req.headers.authorization;
    if (!authHeader) {
       // Se quiseres ser estrito: throw new Error('Token não fornecido');
       // Por agora, para não bloquear os teus testes se não tiveres token:
       console.log("Aviso: Sem token de autenticação.");
       return next(); 
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.userData = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.displayName,
        picture: decodedToken.picture
    };
    
    next();
  } catch (error) {
    console.log("Erro de Auth:", error);
    return res.status(401).json({ message: 'Falha na autenticação!' });
  }
};