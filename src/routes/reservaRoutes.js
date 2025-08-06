const express = require('express');
const router = express.Router();
const { criarReserva, verificarDisponibilidade, verificarCPF } = require('../controllers/reservaController');
const { validarReserva, validarCPFParam } = require('../middleware/validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reserva:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - celular
 *         - quantidadePessoas
 *         - data
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do cliente
 *           example: "João Silva"
 *         cpf:
 *           type: string
 *           description: CPF do cliente (apenas números)
 *           example: "12345678901"
 *         celular:
 *           type: string
 *           description: Número de celular com DDD (apenas números)
 *           example: "11987654321"
 *         quantidadePessoas:
 *           type: integer
 *           minimum: 1
 *           maximum: 4
 *           description: Quantidade de pessoas (1 a 4)
 *           example: 2
 *         data:
 *           type: string
 *           format: date
 *           description: Data da reserva (YYYY-MM-DD)
 *           example: "2024-01-15"
 *     Disponibilidade:
 *       type: object
 *       properties:
 *         data:
 *           type: string
 *           description: Data formatada
 *           example: "15/01/2024"
 *         dataISO:
 *           type: string
 *           description: Data no formato ISO
 *           example: "2024-01-15"
 *         reservasExistentes:
 *           type: integer
 *           description: Número de reservas existentes
 *           example: 2
 *         mesasDisponiveis:
 *           type: integer
 *           description: Número de mesas disponíveis
 *           example: 3
 *         disponivel:
 *           type: boolean
 *           description: Se há mesas disponíveis
 *           example: true
 */

/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Criar uma nova reserva
 *     description: Cria uma nova reserva para o restaurante
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
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
 *                   example: "Reserva criada com sucesso!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1703123456789
 *                     nome:
 *                       type: string
 *                       example: "João Silva"
 *                     cpf:
 *                       type: string
 *                       example: "123.456.789-01"
 *                     celular:
 *                       type: string
 *                       example: "11987654321"
 *                     quantidadePessoas:
 *                       type: integer
 *                       example: 2
 *                     data:
 *                       type: string
 *                       example: "15/01/2024"
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
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       409:
 *         description: CPF já possui reserva ativa
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
 *                   example: "CPF já possui uma reserva ativa"
 *                 dataReserva:
 *                   type: string
 *                   example: "15/01/2024"
 *       422:
 *         description: Limite de reservas atingido
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
 *                   example: "Limite de reservas para esta data foi atingido"
 */
router.post('/', validarReserva, criarReserva);

/**
 * @swagger
 * /api/reservas/disponibilidade:
 *   get:
 *     summary: Verificar disponibilidade de datas
 *     description: Retorna a disponibilidade de mesas para as próximas datas
 *     tags: [Reservas]
 *     parameters:
 *       - in: query
 *         name: data
 *         schema:
 *           type: string
 *           format: date
 *         description: Data específica para verificar (opcional)
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Disponibilidade retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         data:
 *                           type: string
 *                           example: "15/01/2024"
 *                         reservasExistentes:
 *                           type: integer
 *                           example: 2
 *                         mesasDisponiveis:
 *                           type: integer
 *                           example: 3
 *                         disponivel:
 *                           type: boolean
 *                           example: true
 *                     - type: array
 *                       items:
 *                         $ref: '#/components/schemas/Disponibilidade'
 */
router.get('/disponibilidade', verificarDisponibilidade);

/**
 * @swagger
 * /api/reservas/verificar/{cpf}:
 *   get:
 *     summary: Verificar se CPF tem reserva ativa
 *     description: Verifica se um CPF específico possui uma reserva ativa
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF a ser verificado
 *         example: "12345678901"
 *     responses:
 *       200:
 *         description: Verificação realizada com sucesso
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
 *                     temReserva:
 *                       type: boolean
 *                       example: true
 *                     reserva:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1703123456789
 *                         nome:
 *                           type: string
 *                           example: "João Silva"
 *                         cpf:
 *                           type: string
 *                           example: "123.456.789-01"
 *                         celular:
 *                           type: string
 *                           example: "11987654321"
 *                         quantidadePessoas:
 *                           type: integer
 *                           example: 2
 *                         data:
 *                           type: string
 *                           example: "15/01/2024"
 *       400:
 *         description: CPF inválido
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
 */
router.get('/verificar/:cpf', validarCPFParam, verificarCPF);

module.exports = router; 