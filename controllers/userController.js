const admin = require('firebase-admin');
const db = admin.firestore();

exports.getUser = async (req, res) => {
  try {
    const userData = req.userData;
    
    // Log para ver quem está a pedir
    console.log("🔍 A procurar dados para o UID:", userData.uid);

    if (!userData) {
      return res.status(401).json({ message: "Utilizador não autenticado" });
    }

    // 1. Tenta pegar o nome que vem no Token (Google login, etc)
    let finalName = userData.name;
    
    // 2. Se não houver nome no token, vai ao Firestore buscar o 'nome'
    if (!finalName) {
        try {
            const userDoc = await db.collection('users').doc(userData.uid).get();
            
            if (userDoc.exists) {
                const dados = userDoc.data();
                console.log("📂 Dados encontrados no banco:", dados); // Vê isto no terminal!

                // AQUI ESTÁ O SEGREDO:
                // O Cadastro salvou como 'nome', então lemos 'nome'.
                if (dados.nome) {
                    finalName = dados.nome;
                } else if (dados.name) {
                    finalName = dados.name;
                }
            } else {
                console.log("⚠️ Documento do utilizador não existe no Firestore.");
            }
        } catch (e) {
            console.log("❌ Erro ao ler banco de dados:", e);
        }
    }

    // 3. Monta a resposta final
    // Se mesmo depois de tudo não houver nome, usa "Utilizador (Sem Nome)" para saberes.
    const user = {
      name: finalName || "Utilizador", 
      email: userData.email,
      avatar: userData.picture || "https://github.com/jleandromorais.png"
    };

    console.log("✅ A enviar para o Front:", user.name);
    res.status(200).json(user);

  } catch (error) {
    console.error("☠️ Erro crítico no getUser:", error);
    res.status(500).json({ message: "Erro ao buscar informações do utilizador" });
  }
};