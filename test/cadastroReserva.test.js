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
                console.log(dataFormatada, cpf)
            } 
            expect(statusCadastro.status).to.equal(422)
            expect(statusCadastro.body.message).to.equal('Limite de reservas para esta data foi atingido (máximo 5 reservas por dia)')
        });
    });
});