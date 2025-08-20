const request = require('supertest')
const { expect } = require('chai')
require('dotenv').config()
const { cadastrarNovaReserva } = require('../helpers/cadastroReserva.js')
const { gerarDadosCadastro } = require('../helpers/gerarDadosCadastro.js')
const { gerarCpfValido } = require('../helpers/gerarCpfValido.js')
let dadosReserva


describe('Reservas', () => {
    describe('POST /api/reservas', () => {
        beforeEach(() => {
            dadosReserva = gerarDadosCadastro()
        });
        it('Realizar reserva para o dia atual com dados válidos, retorna sucesso 201 (US01 - CTO1)', async () => {
            const hoje = new Date().toISOString().slice(0, 10);
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, quantidadedePessoas, hoje)
            expect(statusCadastro.status).to.equal(201)
            expect(statusCadastro.body.message).to.equal('Reserva criada com sucesso!')
        });

        it('Realizar reserva para o data futura com dados válidos, retorna sucesso 201 (US01 - CTO2)', async () => {
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, quantidadedePessoas, dataFormatada)
            expect(statusCadastro.status).to.equal(201)
            expect(statusCadastro.body.message).to.equal('Reserva criada com sucesso!')
        });

        it('Tentar realizar reserva com CPF que já possui reserva ativa, retorna erro 409 (US01 - CTO3)', async () => {
            let statusCadastro
            for (let i = 0; i < 2; i++) {
                statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, quantidadedePessoas, dataFormatada)
            }
            expect(statusCadastro.status).to.equal(409)
            expect(statusCadastro.body.message).to.equal('CPF já possui uma reserva ativa. Só será possível fazer nova reserva após a data da reserva atual.')
        });

        it('Tentar realizar reserva para uma data já preenchida com 5 reservas, retorna erro 422 (US01 - CTO4)', async () => {
            let statusCadastro
            for (let i = 0; i < 6; i++) {
                cpf = gerarCpfValido()
                statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, quantidadedePessoas, dataFormatada)
            }
            expect(statusCadastro.status).to.equal(422)
            expect(statusCadastro.body.message).to.equal('Limite de reservas para esta data foi atingido (máximo 5 reservas por dia)')
        });

        it('Tentar realizar reserva CPF inválido no cadastro, retorna erro 400 (US01 - CTO5)', async () => {
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, '12345678933', celular, quantidadedePessoas, dataFormatada)
            expect(statusCadastro.status).to.equal(400)
            expect(statusCadastro.body.errors[0].msg).to.equal('CPF inválido')
        });

        it('Tentar realizar reserva com nome completo vazio, retorna erro 400 (US01 - CTO6)', async () => {
            const statusCadastro = await cadastrarNovaReserva('', cpf, celular, quantidadedePessoas, dataFormatada)
            expect(statusCadastro.status).to.equal(400)
            expect(statusCadastro.body.errors[0].msg).to.equal('Nome deve ter entre 3 e 100 caracteres')
        });

        it('Tentar realizar reserva com campo de celular vazio, retorna erro 400 (US01 - CTO7)', async () => {
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, '', quantidadedePessoas, dataFormatada)
            expect(statusCadastro.status).to.equal(400)
            expect(statusCadastro.body.errors[0].msg).to.equal('Celular é obrigatório')
        });

        it('Tentar realizar reserva com quantidade de pessoas < 1, retorna erro 400 (US01 - CTO8)', async () => {
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, 0, dataFormatada)
            expect(statusCadastro.status).to.equal(400)
            expect(statusCadastro.body.errors[0].msg).to.equal('Quantidade de pessoas deve ser entre 1 e 4')
        });

        it('Tentar realizar reserva com quantidade de pessoas > 4, retorna erro 400 (US01 - CTO8)', async () => {
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, 5, dataFormatada)
            expect(statusCadastro.status).to.equal(400)
            expect(statusCadastro.body.errors[0].msg).to.equal('Quantidade de pessoas deve ser entre 1 e 4')
        });

        it('Tentar realizar reserva sem enviar data, retorna erro 400 (US01 - CTO9)', async () => {
            const statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, quantidadedePessoas, '')
            expect(statusCadastro.status).to.equal(400)
            expect(statusCadastro.body.errors[0].msg).to.equal('Data é obrigatória')
        });
    });

    describe('GET /api/reservas/disponibilidade', () => {
        beforeEach(() => {
            dadosReserva = gerarDadosCadastro()
        });

        it('Informando a data de reserva, deve retornar quantas mesas há disponível para reserva (US01 - CT10)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/api/reservas/disponibilidade')
                .set('Content-type', 'application/json')
                .send({
                    'date': '2025-08-19'
                })
            expect(resposta.status).to.equal(200)
            expect(resposta.body.data[0].reservasExistentes).is.a('number');
            expect(resposta.body.data[0].mesasDisponiveis).is.a('number');
        });

        it('Informando a data de reserva já cheia, deve retornar que está indisponível (US01 - CT11)', async () => {
            for (let i = 0; i < 6; i++) {
                cpf = gerarCpfValido()
                statusCadastro = await cadastrarNovaReserva(nomeCompleto, cpf, celular, quantidadedePessoas, dataFormatada)
            }
            const resposta = await request(process.env.BASE_URL)
                .get(`/api/reservas/disponibilidade?data=${dataFormatada}`)
                .set('Content-type', 'application/json')

            expect(resposta.status).to.equal(200)
            expect(resposta.body.data.disponivel).to.be.false;
        });
    });
});