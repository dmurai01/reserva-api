const { faker } = require('@faker-js/faker/locale/pt_BR')
const { gerarCpfValido } = require('../helpers/gerarCpfValido.js')

const gerarDadosCadastro = () => {
        novoCpf = gerarCpfValido()
        nome = faker.person.firstName()
        sobrenome = faker.person.lastName()
        nomeCompleto = `${nome} ${sobrenome}`
        cpf = `${novoCpf}`
        celular = '11999996666'
        quantidadedePessoas = Math.floor(Math.random() * 4) + 1
        data = faker.date.future()
        dataFormatada = data.toISOString().split('T')[0];
}

module.exports = {
    gerarDadosCadastro
}


