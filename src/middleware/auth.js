const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

/**
 * Middleware para verificar token JWT
 */
const verificarToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acesso não fornecido'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar se o usuário é administrador
 */
const verificarAdmin = async (req, res, next) => {
  try {
    const adminsPath = path.join(__dirname, '../data/admins.json');
    const adminsData = await fs.readFile(adminsPath, 'utf8');
    const admins = JSON.parse(adminsData);
    
    const admin = admins.find(a => a.id === req.usuario.id);
    
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao verificar permissões de administrador'
    });
  }
};

module.exports = {
  verificarToken,
  verificarAdmin
}; 