const request = require('supertest')
require('dotenv').config()

const cadastrarNovaReserva = async (nomeCompleto, cpf, celular, quantidadedePessoas, dataFormatada) => {
    const resposta = await request(process.env.BASE_URL)
        .post('/api/reservas')
        .set('Content-type', 'application/json')
        .send({
            'nome': `${nomeCompleto}`,
            'cpf': `${cpf}`,
            'celular': celular,
            'quantidadePessoas': quantidadedePessoas,
            'data': dataFormatada
        })
    return resposta
}

module.exports = {
    cadastrarNovaReserva
}