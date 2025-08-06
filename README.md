# API de Reservas de Restaurante

## Descrição

API REST desenvolvida em Node.js com Express para gerenciamento de reservas de restaurante. O sistema permite que usuários façam reservas e administradores gerenciem essas reservas.

## Funcionalidades

### Para Usuários
- Cadastro de reservas para data atual ou futura
- Validação de CPF
- Limite de uma reserva por CPF
- Limite de 5 reservas por dia
- Campos obrigatórios: nome completo, celular com DDD, quantidade de pessoas (1-4), data da reserva
- Verificação de disponibilidade de mesas
- Confirmação de reserva

### Para Administradores
- Login de administrador
- Visualização de relatório de reservas
- Acesso a dados completos das reservas

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Swagger** - Documentação da API
- **bcryptjs** - Criptografia de senhas
- **jsonwebtoken** - Autenticação JWT
- **express-validator** - Validação de dados
- **moment** - Manipulação de datas
- **cors** - Cross-Origin Resource Sharing
- **helmet** - Segurança HTTP
- **morgan** - Logging de requisições

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd reserva-api
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Inicializar administrador (opcional, feito automaticamente)
npm run init
```

## Estrutura do Projeto

```
reserva-api/
├── src/
│   ├── controllers/
│   │   ├── reservaController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── reservaRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── cpfValidator.js
│   │   └── dateUtils.js
│   ├── data/
│   │   ├── reservas.json
│   │   └── admins.json
│   └── server.js
├── package.json
└── README.md
```

## Endpoints da API

### Reservas (Público)
- `POST /api/reservas` - Criar nova reserva
- `GET /api/reservas/disponibilidade` - Verificar disponibilidade de datas
- `GET /api/reservas/verificar/:cpf` - Verificar se CPF tem reserva ativa

### Administrador (Protegido)
- `POST /api/admin/login` - Login de administrador
- `GET /api/admin/reservas` - Listar todas as reservas
- `GET /api/admin/reservas/:data` - Listar reservas por data

## Documentação

A documentação completa da API está disponível através do Swagger UI:

**URL da Documentação:** http://localhost:3000/api-docs

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Regras de Negócio

1. **Limite de Reservas**: Máximo 5 reservas por dia
2. **Reserva por CPF**: Apenas uma reserva ativa por CPF
3. **Validação de CPF**: CPF deve ser válido
4. **Quantidade de Pessoas**: Entre 1 e 4 pessoas por reserva
5. **Datas**: Apenas datas atuais ou futuras
6. **Campos Obrigatórios**: Nome, celular, quantidade de pessoas, data

## Exemplo de Uso

### Criar uma Reserva
```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "cpf": "12345678901",
    "celular": "11987654321",
    "quantidadePessoas": 2,
    "data": "2024-01-15"
  }'
```

### Login de Administrador
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## Status Codes

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `409` - Conflito (CPF já tem reserva)
- `422` - Limite de reservas atingido
- `500` - Erro interno do servidor

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. 