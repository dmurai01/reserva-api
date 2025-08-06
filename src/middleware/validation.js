const { body, param, validationResult } = require('express-validator');
const { validarCPF } = require('../utils/cpfValidator');
const { validarData } = require('../utils/dateUtils');

/**
 * Middleware para verificar erros de validação
 */
const verificarErros = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validações para criação de reserva
 */
const validarReserva = [
  body('nome')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('cpf')
    .trim()
    .notEmpty()
    .withMessage('CPF é obrigatório')
    .custom((value) => {
      if (!validarCPF(value)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),
  
  body('celular')
    .trim()
    .notEmpty()
    .withMessage('Celular é obrigatório')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Celular deve ter 10 ou 11 dígitos numéricos'),
  
  body('quantidadePessoas')
    .isInt({ min: 1, max: 4 })
    .withMessage('Quantidade de pessoas deve ser entre 1 e 4'),
  
  body('data')
    .trim()
    .notEmpty()
    .withMessage('Data é obrigatória')
    .custom((value) => {
      if (!validarData(value)) {
        throw new Error('Data deve ser válida e não pode ser passada');
      }
      return true;
    }),
  
  verificarErros
];

/**
 * Validações para login de administrador
 */
const validarLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Usuário é obrigatório'),
  
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  
  verificarErros
];

/**
 * Validações para parâmetros de CPF
 */
const validarCPFParam = [
  param('cpf')
    .trim()
    .notEmpty()
    .withMessage('CPF é obrigatório')
    .custom((value) => {
      if (!validarCPF(value)) {
        throw new Error('CPF inválido');
      }
      return true;
    }),
  
  verificarErros
];

/**
 * Validações para parâmetros de data
 */
const validarDataParam = [
  param('data')
    .trim()
    .notEmpty()
    .withMessage('Data é obrigatória')
    .custom((value) => {
      if (!validarData(value)) {
        throw new Error('Data deve ser válida e não pode ser passada');
      }
      return true;
    }),
  
  verificarErros
];

module.exports = {
  validarReserva,
  validarLogin,
  validarCPFParam,
  validarDataParam,
  verificarErros
}; 