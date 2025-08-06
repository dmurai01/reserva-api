const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { formatarCPF } = require('../utils/cpfValidator');
const { formatarData, validarData } = require('../utils/dateUtils');
const { garantirArquivoExiste } = require('../utils/fileUtils');

/**
 * Login de administrador
 * @route POST /api/admin/login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Garantir que o arquivo de administradores existe
    const admins = await garantirArquivoExiste('admins.json', []);
    
    // Buscar administrador
    const admin = admins.find(a => a.username === username);
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(password, admin.password);
    
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos'
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET || 'sua_chave_secreta',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username
        }
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Listar todas as reservas
 * @route GET /api/admin/reservas
 */
const listarReservas = async (req, res) => {
  try {
    // Garantir que o arquivo de reservas existe
    const reservas = await garantirArquivoExiste('reservas.json', []);
    
    // Filtrar apenas reservas ativas (datas válidas)
    const reservasAtivas = reservas.filter(r => validarData(r.data));
    
    // Formatar dados para exibição
    const reservasFormatadas = reservasAtivas.map(r => ({
      id: r.id,
      nome: r.nome,
      cpf: formatarCPF(r.cpf),
      celular: r.celular,
      quantidadePessoas: r.quantidadePessoas,
      data: formatarData(r.data),
      dataISO: r.data,
      createdAt: r.createdAt
    }));
    
    // Ordenar por data
    reservasFormatadas.sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));
    
    res.json({
      success: true,
      data: {
        total: reservasFormatadas.length,
        reservas: reservasFormatadas
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Listar reservas por data específica
 * @route GET /api/admin/reservas/:data
 */
const listarReservasPorData = async (req, res) => {
  try {
    const { data } = req.params;
    
    // Garantir que o arquivo de reservas existe
    const reservas = await garantirArquivoExiste('reservas.json', []);
    
    // Filtrar reservas da data específica
    const reservasDaData = reservas.filter(r => r.data === data);
    
    // Formatar dados para exibição
    const reservasFormatadas = reservasDaData.map(r => ({
      id: r.id,
      nome: r.nome,
      cpf: formatarCPF(r.cpf),
      celular: r.celular,
      quantidadePessoas: r.quantidadePessoas,
      data: formatarData(r.data),
      createdAt: r.createdAt
    }));
    
    // Ordenar por horário de criação
    reservasFormatadas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    res.json({
      success: true,
      data: {
        data: formatarData(data),
        total: reservasFormatadas.length,
        reservas: reservasFormatadas
      }
    });
    
  } catch (error) {
    console.error('Erro ao listar reservas por data:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * Obter estatísticas das reservas
 * @route GET /api/admin/estatisticas
 */
const obterEstatisticas = async (req, res) => {
  try {
    // Garantir que o arquivo de reservas existe
    const reservas = await garantirArquivoExiste('reservas.json', []);
    
    // Filtrar apenas reservas ativas
    const reservasAtivas = reservas.filter(r => validarData(r.data));
    
    // Calcular estatísticas
    const totalReservas = reservasAtivas.length;
    const reservasHoje = reservasAtivas.filter(r => r.data === new Date().toISOString().split('T')[0]).length;
    
    // Agrupar por data
    const reservasPorData = {};
    reservasAtivas.forEach(r => {
      if (!reservasPorData[r.data]) {
        reservasPorData[r.data] = [];
      }
      reservasPorData[r.data].push(r);
    });
    
    // Calcular datas com mais reservas
    const datasComMaisReservas = Object.entries(reservasPorData)
      .map(([data, reservas]) => ({
        data: formatarData(data),
        total: reservas.length
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
    
    res.json({
      success: true,
      data: {
        totalReservas,
        reservasHoje,
        datasComMaisReservas,
        proximasDatas: Object.keys(reservasPorData).slice(0, 7).map(data => ({
          data: formatarData(data),
          total: reservasPorData[data].length
        }))
      }
    });
    
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  login,
  listarReservas,
  listarReservasPorData,
  obterEstatisticas
}; 