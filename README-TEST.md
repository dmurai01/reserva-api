# Documentação de Testes - API de Reservas de Restaurante

Este documento descreve a estrutura de automação de testes implementada para o projeto de API de Reservas de Restaurante.

## Tecnologias Utilizadas

- **Mocha**: Framework de testes para JavaScript
- **Chai**: Biblioteca de asserções para testes
- **Supertest**: Biblioteca para testar APIs HTTP
- **Mochawesome**: Gerador de relatórios para testes Mocha
- **dotenv**: Gerenciamento de variáveis de ambiente

## Estrutura de Pastas e Arquivos

```
├── test/
│   ├── admin.test.js       # Testes para funcionalidades de administrador
│   └── cadastroReserva.test.js  # Testes para funcionalidades de reserva
├── helpers/
│   ├── cadastroReserva.js   # Funções auxiliares para testes de reserva
│   ├── gerarCpfValido.js    # Gerador de CPF válido para testes
│   ├── gerarDadosCadastro.js # Gerador de dados para cadastro de reserva
│   ├── loginAdmin.js        # Funções auxiliares para login de administrador
│   └── reservas.js          # Funções auxiliares para testes de reservas
```

### Descrição dos Arquivos

#### Arquivos de Teste

- **admin.test.js**: Contém testes para validar o acesso ao painel administrativo e operações de administrador, como pesquisa de reservas por data.

- **cadastroReserva.test.js**: Contém testes para validar o processo de cadastro de reservas, incluindo cenários de sucesso e falha.

#### Arquivos Auxiliares (Helpers)

- **cadastroReserva.js**: Contém funções para realizar requisições de cadastro de reservas durante os testes.

- **gerarCpfValido.js**: Gera CPFs válidos para uso nos testes.

- **gerarDadosCadastro.js**: Gera dados aleatórios para cadastro de reservas.

- **loginAdmin.js**: Contém funções para realizar login como administrador durante os testes.

- **reservas.js**: Contém funções para consultar reservas durante os testes.

## Casos de Teste

Os testes foram organizados por histórias de usuário (US) e casos de teste (CT):

### US01 - Cadastro de Reservas
- CT01: Realizar reserva para o dia atual com dados válidos
- CT02: Realizar reserva para data futura com dados válidos
- CT03: Tentar realizar reserva com CPF que já possui reserva ativa
- CT04: Tentar realizar reserva para uma data já preenchida com 5 reservas
- CT05: Tentar realizar reserva com CPF inválido

### US02 - Painel Administrativo
- CT01: Validar acesso no painel administrativo com credenciais válidas
- CT02: Validar acesso no painel administrativo com credenciais inválidas
- CT03: Validar pesquisa de reservas por data
- CT04: Validar pesquisa de todas as reservas

## Instalação e Execução dos Testes

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo .env com base no arquivo env.example:

```
BASE_URL=http://localhost:3000
```

### Execução dos Testes

Para executar todos os testes:

```bash
npm test
```

Este comando executará todos os testes e gerará um relatório usando o Mochawesome, que pode ser encontrado na pasta `mochawesome-report`.

### Relatórios

Após a execução dos testes, um relatório HTML será gerado na pasta `mochawesome-report`. Este relatório contém informações detalhadas sobre os testes executados, incluindo:

- Número total de testes
- Testes que passaram e falharam
- Tempo de execução
- Detalhes de cada teste

Para visualizar o relatório, abra o arquivo `mochawesome-report/mochawesome.html` em um navegador web.