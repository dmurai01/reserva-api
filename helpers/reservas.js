const request = require('supertest')
require('dotenv').config()

const reservas = async (token, data) => {
    const resposta = await request(process.env.BASE_URL)
        .get(`/api/admin/reservas/${data}`)
        .set('Content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
    return resposta
}

module.exports = {
    reservas
}