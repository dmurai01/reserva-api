const request = require('supertest')
require('dotenv').config()

const loginAdmin = async() => {
    const resposta = await request(process.env.BASE_URL)
        .post('/api/admin/login')
        .set('Content-type', 'application/json')
        .send({
            'username': process.env.ADMIN_USERNAME,
            'password': process.env.ADMIN_PASSWORD
        })
    return resposta
}

const loginAdminInvalido = async() => {
    const resposta = await request(process.env.BASE_URL)
        .post('/api/admin/login')
        .set('Content-type', 'application/json')
        .send({
            'username': process.env.ADMIN_USERNAME,
            'password': '525252'
        })
    return resposta
}

module.exports = {
    loginAdmin,
    loginAdminInvalido
}