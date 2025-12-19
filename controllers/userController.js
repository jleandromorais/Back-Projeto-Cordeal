exports.getUser = async (req, res) => {
  try {
    // Tenta pegar o nome do userData (do checkAuth) ou usa um genérico
    const userData = req.userData || {};
    
    const user = {
      name: userData.name || "Leandro (Admin)", // Fallback se não vier do token
      email: userData.email || "email@exemplo.com",
      avatar: userData.picture || "https://github.com/jleandromorais.png"
    };

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro no getUser:", error);
    res.status(500).json({ message: "Erro ao buscar informações do utilizador" });
  }
};