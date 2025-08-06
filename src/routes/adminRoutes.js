const express = require('express');
const router = express.Router();
const { login, listarReservas, listarReservasPorData, obterEstatisticas } = require('../controllers/adminController');
const { validarLogin, validarDataParam } = require('../middleware/validation');
const { verificarToken, verificarAdmin } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nome de usuário do administrador
 *           example: "admin"
 *         password:
 *           type: string
 *           description: Senha do administrador
 *           example: "admin123"
 *     AdminReserva:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1703123456789
 *         nome:
 *           type: string
 *           example: "João Silva"
 *         cpf:
 *           type: string
 *           example: "123.456.789-01"
 *         celular:
 *           type: string
 *           example: "11987654321"
 *         quantidadePessoas:
 *           type: integer
 *           example: 2
 *         data:
 *           type: string
 *           example: "15/01/2024"
 *         dataISO:
 *           type: string
 *           example: "2024-01-15"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login de administrador
 *     description: Realiza login de administrador e retorna token JWT
 *     tags: [Administrador]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login realizado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT para autenticação
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     admin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: "admin"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dados inválidos"
 *       401:
 *         description: Usuário ou senha inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Usuário ou senha inválidos"
 */
router.post('/login', validarLogin, login);

/**
 * @swagger
 * /api/admin/reservas:
 *   get:
 *     summary: Listar todas as reservas
 *     description: Retorna todas as reservas ativas ordenadas por data
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     reservas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdminReserva'
 *       401:
 *         description: Token não fornecido ou inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Token de acesso não fornecido"
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Acesso negado. Apenas administradores podem acessar este recurso."
 */
router.get('/reservas', verificarToken, verificarAdmin, listarReservas);

/**
 * @swagger
 * /api/admin/reservas/{data}:
 *   get:
 *     summary: Listar reservas por data
 *     description: Retorna todas as reservas de uma data específica
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data das reservas (YYYY-MM-DD)
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Reservas da data retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: string
 *                       example: "15/01/2024"
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     reservas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/AdminReserva'
 *       400:
 *         description: Data inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Dados inválidos"
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get('/reservas/:data', verificarToken, verificarAdmin, validarDataParam, listarReservasPorData);

/**
 * @swagger
 * /api/admin/estatisticas:
 *   get:
 *     summary: Obter estatísticas das reservas
 *     description: Retorna estatísticas gerais das reservas
 *     tags: [Administrador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalReservas:
 *                       type: integer
 *                       example: 15
 *                     reservasHoje:
 *                       type: integer
 *                       example: 3
 *                     datasComMaisReservas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data:
 *                             type: string
 *                             example: "15/01/2024"
 *                           total:
 *                             type: integer
 *                             example: 5
 *                     proximasDatas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           data:
 *                             type: string
 *                             example: "15/01/2024"
 *                           total:
 *                             type: integer
 *                             example: 3
 *       401:
 *         description: Token não fornecido ou inválido
 *       403:
 *         description: Acesso negado
 */
router.get('/estatisticas', verificarToken, verificarAdmin, obterEstatisticas);

module.exports = router; 