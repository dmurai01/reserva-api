# API de Reservas de Restaurante

## Descrição

API REST desenvolvida em Node.js com Express para gerenciamento de reservas de restaurante. O sistema permite que usuários façam reservas e administradores gerenciem essas reservas.
API criada com GenAI, para 

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
git clone https://github.com/dmurai01/reserva-api.git
cd reserva-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

4. Inicialize o administrador padrão:
```bash
npm run init
```

5. Execute o projeto:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Estrutura do Projeto

```
reserva-api/
├── src/
│   ├── controllers/
│   │   ├── reservaController.js    # Lógica de negócio para reservas
│   │   └── adminController.js      # Lógica de negócio para administradores
│   ├── middleware/
│   │   ├── auth.js                 # Autenticação JWT
│   │   └── validation.js           # Validação de dados de entrada
│   ├── routes/
│   │   ├── reservaRoutes.js        # Rotas públicas de reservas
│   │   └── adminRoutes.js          # Rotas protegidas de administradores
│   ├── utils/
│   │   ├── cpfValidator.js         # Validação e formatação de CPF
│   │   ├── dateUtils.js            # Utilitários para manipulação de datas
│   │   └── fileUtils.js            # Utilitários para criação dinâmica de arquivos
│   ├── scripts/
│   │   └── initAdmin.js            # Script para inicializar administrador padrão
│   ├── data/                       # Arquivos de dados (criados dinamicamente)
│   │   ├── reservas.json           # Dados das reservas
│   │   └── admins.json             # Dados dos administradores
│   └── server.js                   # Arquivo principal da aplicação
├── .env                            # Variáveis de ambiente
├── .env.example                    # Exemplo de variáveis de ambiente
├── .gitignore                      # Arquivos ignorados pelo Git
├── nodemon.json                    # Configuração do nodemon
├── package.json                    # Dependências e scripts
└── README.md                       # Documentação do projeto
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
- `GET /api/admin/estatisticas` - Obter estatísticas das reservas

## Documentação

A documentação completa da API está disponível através do Swagger UI:

**URL da Documentação:** http://localhost:3000/api-docs

### Como usar a documentação:

1. **Acesse a URL**: http://localhost:3000/api-docs
2. **Teste endpoints públicos**: Reservas podem ser testadas diretamente
3. **Para endpoints protegidos**:
   - Faça login primeiro em `POST /api/admin/login`
   - Copie o token da resposta
   - Clique no ícone de cadeado 🔒 no endpoint
   - Cole o token (sem "Bearer")
   - Clique em "Authorize"
   - Agora você pode testar endpoints protegidos

### Endpoints Protegidos:
- `GET /api/admin/reservas` - Listar todas as reservas
- `GET /api/admin/reservas/:data` - Listar reservas por data
- `GET /api/admin/estatisticas` - Obter estatísticas

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto. Exemplo:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui_muito_segura
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

### Descrição das Variáveis:
- **PORT**: Porta onde o servidor irá rodar (padrão: 3000)
- **JWT_SECRET**: Chave secreta para assinar tokens JWT (obrigatória)
- **ADMIN_USERNAME**: Nome de usuário do administrador padrão
- **ADMIN_PASSWORD**: Senha do administrador padrão
- **NODE_ENV**: Ambiente de execução (development/production)

## Regras de Negócio

1. **Limite de Reservas**: Máximo 5 reservas por dia
2. **Reserva por CPF**: Apenas uma reserva ativa por CPF
3. **Validação de CPF**: CPF deve ser válido
4. **Quantidade de Pessoas**: Entre 1 e 4 pessoas por reserva
5. **Datas**: Apenas datas atuais ou futuras
6. **Campos Obrigatórios**: Nome, celular, quantidade de pessoas, data
7. **Criação Dinâmica**: Arquivos de dados são criados automaticamente na primeira reserva
8. **Autenticação**: Endpoints de administrador requerem token JWT válido

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

## Scripts Disponíveis

- `npm start` - Inicia o servidor em modo produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm run init` - Inicializa o administrador padrão

## Características Técnicas

- **Criação Dinâmica de Arquivos**: Os arquivos `reservas.json` e `admins.json` são criados automaticamente
- **Validação Robusta**: Validação de CPF, datas, e dados de entrada
- **Autenticação JWT**: Sistema seguro de autenticação para administradores
- **Documentação Swagger**: API documentada e testável via Swagger UI
- **Configuração Flexível**: Variáveis de ambiente para diferentes ambientes
- **Logs Detalhados**: Sistema de logging para monitoramento

## Arquivos de Dados

### 📁 `src/data/reservas.json`
**Propósito:** Armazena todas as reservas do restaurante

**Estrutura:**
```json
[
  {
    "id": 1754501142504,
    "nome": "João Silva",
    "cpf": "12345678901",
    "celular": "11987654321",
    "quantidadePessoas": 2,
    "data": "2025-01-15",
    "createdAt": "2025-08-06T17:25:42.504Z"
  }
]
```

**Características:**
- ✅ **Criado automaticamente** na primeira reserva
- ✅ **Formato JSON** para fácil leitura
- ✅ **ID único** baseado em timestamp
- ✅ **CPF limpo** (apenas números)
- ✅ **Data ISO** para padronização

### 📁 `src/data/admins.json`
**Propósito:** Armazena credenciais dos administradores

**Estrutura:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "password": "$2a$10$ZRVinJkqwLTP.fdMRajN4OK9/IbVcYUw9ZSxF6B372UPnCFGaXHZy",
    "createdAt": "2025-08-06T17:25:59.486Z"
  }
]
```

**Características:**
- ✅ **Senha criptografada** com bcrypt
- ✅ **Criado pelo script** `npm run init`
- ✅ **Hash seguro** para proteção
- ✅ **Username único** por administrador

### 🔧 **Gerenciamento dos Arquivos**

#### **Criação Automática:**
```bash
# Primeira reserva criará automaticamente:
# - src/data/reservas.json (se não existir)
# - src/data/admins.json (se não existir)
```

#### **Inicialização Manual:**
```bash
# Criar administrador padrão
npm run init
```

#### **Localização:**
```
src/data/
├── reservas.json    # Dados das reservas
└── admins.json      # Dados dos administradores
```

#### **Backup e Restauração:**
```bash
# Backup dos dados
cp src/data/reservas.json backup_reservas.json
cp src/data/admins.json backup_admins.json

# Restaurar dados
cp backup_reservas.json src/data/reservas.json
cp backup_admins.json src/data/admins.json
```

### ⚠️ **Importante:**
- **Não edite manualmente** os arquivos durante a execução
- **Faça backup** antes de modificações
- **Os arquivos são criados** automaticamente se não existirem
- **Formato JSON** deve ser mantido para funcionamento correto

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

