const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { loginAdmin } = require('../helpers/loginAdmin.js')
const { loginAdminInvalido } = require('../helpers/loginAdmin.js')
const { reservas } = require('../helpers/reservas.js')

describe('Administrador', () => {
    describe('POST /api/admin/login', () => {
        it('Validar acesso no painel administrativo com credenciais válidas (US02 - CT01)', async () => {
            const resposta = await loginAdmin()
            expect(resposta.status).to.equal(200)
            expect(resposta.body.data.token).to.be.exist
        });

        it('Validar acesso no painel administrativo com credenciais inválidas (US02 - CT02)', async () => {
            const resposta = await loginAdminInvalido()
            expect(resposta.status).to.equal(401)
            expect(resposta.body.message).to.equal('Usuário ou senha inválidos')
        });
    });

    describe('GET /api/admin/reservas/', () => {
        let token
        beforeEach(async () => {
            const resposta = await loginAdmin()
            token = resposta.body.data.token
        });

        it('Validar pesquisa de todas as reservas com token válido (US02 - CT04)', async () => {
            const resposta = await reservas(token, '')
            expect(resposta.body.success).to.be.true
        });
        it('Validar pesquisa de todas as reservas com token inválido, deve retornar erro (US02 - CT04-A)', async () => {
            const resposta = await reservas('tokeninvalido', '')
            expect(resposta.body.success).to.be.false
            expect(resposta.body.message).to.equal('Token inválido')
        });

        it('Validar se pesquisa reservas por data retorna dados corretos (US02 - CT03)', async () => {
            const resposta = await reservas(token, '2025-08-20')
            expect(resposta.status).to.equal(200)
            expect(resposta.body.success).to.be.true
            expect(resposta.body.data.data).to.equal('20/08/2025');
        });

        it('Validar se pesquisa reservas por data sem autenticação deve retornar erro (US02 - CT03-A)', async () => {
            const resposta = await reservas('', '2025-08-20')
            expect(resposta.status).to.equal(401)
            expect(resposta.body.success).to.be.false
            expect(resposta.body.message).to.equal('Token de acesso não fornecido')
        });

        it('Validar se pesquisa reservas por data errada deve retornar erro (US02 - CT03-B)', async () => {
            const resposta = await reservas(token, '2025-08-33')
            expect(resposta.status).to.equal(400)
            expect(resposta.body.success).to.be.false
            expect(resposta.body.message).to.equal('Dados inválidos')
        });

    });
});