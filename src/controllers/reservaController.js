const { validarCPF, formatarCPF } = require('../utils/cpfValidator');
const { validarData, formatarData, getDataAtual } = require('../utils/dateUtils');
const { garantirArquivoExiste, salvarDados } = require('../utils/fileUtils');

/**
 * Criar uma nova reserva
 * @route POST /api/reservas
 */
const criarReserva = async (req, res) => {
  try {
    const { nome, cpf, celular, quantidadePessoas, data } = req.body;
    
    // Garantir que o arquivo de reservas existe
    const reservas = await garantirArquivoExiste('reservas.json', []);
    
    // Verificar se CPF já tem reserva ativa
    const reservaAtiva = reservas.find(r => 
      r.cpf === cpf.replace(/[^\d]/g, '') && 
      validarData(r.data)
    );
    
    if (reservaAtiva) {
      return res.status(409).json({
        success: false,
        message: 'CPF já possui uma reserva ativa. Só será possível fazer nova reserva após a data da reserva atual.',
        dataReserva: formatarData(reservaAtiva.data)
      });
    }
    
    // Verificar limite de reservas por dia (máximo 5)
    const reservasDoDia = reservas.filter(r => r.data === data);
    if (reservasDoDia.length >= 5) {
      return res.status(422).json({
        success: false,
        message: 'Limite de reservas para esta data foi atingido (máximo 5 reservas por dia)'
      });
    }
    
    // Criar nova reserva
    const novaReserva = {
      id: Date.now(),
      nome: nome.trim(),
      cpf: cpf.replace(/[^\d]/g, ''),
      celular: celular.trim(),
      quantidadePessoas: parseInt(quantidadePessoas),
      data: data,
      createdAt: new Date().toISOString()
    };
    
    // Adicionar à lista de reservas
    reservas.push(novaReserva);
    
    // Salvar no arquivo
    await salvarDados('reservas.json', reservas);
    
    res.status(201).json({
      success: true,
      message: 'Reserva criada com sucesso!',
      data: {
        id: novaReserva.id,
        nome: novaReserva.nome,
        cpf: formatarCPF(novaReserva.cpf),
        celular: novaReserva.celular,
        quantidadePessoas: novaReserva.quantidadePessoas,
        data: formatarData(novaReserva.data),
        createdAt: novaReserva.createdAt
      }
    });
    
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Verificar disponibilidade de datas
 * @route GET /api/reservas/disponibilidade
 */
const verificarDisponibilidade = async (req, res) => {
  try {
    const { data } = req.query;
    
    // Garantir que o arquivo de reservas existe
    const reservas = await garantirArquivoExiste('reservas.json', []);
    
    if (data) {
      // Verificar disponibilidade para data específica
      const reservasDaData = reservas.filter(r => r.data === data);
      const disponivel = reservasDaData.length < 5;
      
      return res.json({
        success: true,
        data: {
          data: formatarData(data),
          reservasExistentes: reservasDaData.length,
          mesasDisponiveis: 5 - reservasDaData.length,
          disponivel: disponivel
        }
      });
    }
    
    // Retornar disponibilidade para próximos 30 dias
    const hoje = getDataAtual();
    const disponibilidade = [];
    
    for (let i = 0; i < 30; i++) {
      const dataVerificacao = new Date();
      dataVerificacao.setDate(dataVerificacao.getDate() + i);
      const dataFormatada = dataVerificacao.toISOString().split('T')[0];
      
      const reservasDaData = reservas.filter(r => r.data === dataFormatada);
      const mesasDisponiveis = 5 - reservasDaData.length;
      
      disponibilidade.push({
        data: formatarData(dataFormatada),
        dataISO: dataFormatada,
        reservasExistentes: reservasDaData.length,
        mesasDisponiveis: mesasDisponiveis,
        disponivel: mesasDisponiveis > 0
      });
    }
    
    res.json({
      success: true,
      data: disponibilidade
    });
    
  } catch (error) {
    console.error('Erro ao verificar disponibilidade:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Verificar se CPF tem reserva ativa
 * @route GET /api/reservas/verificar/:cpf
 */
const verificarCPF = async (req, res) => {
  try {
    const { cpf } = req.params;
    const cpfLimpo = cpf.replace(/[^\d]/g, '');
    
    // Garantir que o arquivo de reservas existe
    const reservas = await garantirArquivoExiste('reservas.json', []);
    
    // Buscar reserva ativa para o CPF
    const reservaAtiva = reservas.find(r => 
      r.cpf === cpfLimpo && 
      validarData(r.data)
    );
    
    if (reservaAtiva) {
      return res.json({
        success: true,
        data: {
          temReserva: true,
          reserva: {
            id: reservaAtiva.id,
            nome: reservaAtiva.nome,
            cpf: formatarCPF(reservaAtiva.cpf),
            celular: reservaAtiva.celular,
            quantidadePessoas: reservaAtiva.quantidadePessoas,
            data: formatarData(reservaAtiva.data),
            createdAt: reservaAtiva.createdAt
          }
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        temReserva: false,
        reserva: null
      }
    });
    
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  criarReserva,
  verificarDisponibilidade,
  verificarCPF
}; 