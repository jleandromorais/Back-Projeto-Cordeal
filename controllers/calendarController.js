// Função para listar eventos (GET)
exports.getEvents = async (req, res) => {
  try {
    // Aqui viria a lógica para buscar no banco de dados
    res.status(200).json([
        { date: '2025-11-07', title: 'Reunião de equipa' },
        { date: '2025-11-08', title: 'Entrega de projeto' }
    ]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar eventos" });
  }
};

// Função para criar evento (POST)
exports.createEvent = async (req, res) => {
  try {
    const novoEvento = req.body;
    console.log("Novo evento recebido:", novoEvento);
    res.status(201).json({ message: "Evento criado com sucesso!", event: novoEvento });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar evento" });
  }
};