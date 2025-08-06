const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

/**
 * Script para inicializar o administrador padrão
 */
async function inicializarAdmin() {
  try {
    const adminsPath = path.join(__dirname, '../data/admins.json');
    
    // Verificar se o arquivo já existe
    try {
      await fs.access(adminsPath);
      console.log('Arquivo de administradores já existe. Pulando inicialização.');
      return;
    } catch (error) {
      // Arquivo não existe, continuar com a inicialização
    }
    
    // Criar senha criptografada
    const senha = process.env.ADMIN_PASSWORD || 'admin123';
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    
    // Dados do administrador padrão
    const admin = {
      id: 1,
      username: process.env.ADMIN_USERNAME || 'admin',
      password: senhaCriptografada,
      createdAt: new Date().toISOString()
    };
    
    // Criar diretório se não existir
    const dataDir = path.dirname(adminsPath);
    try {
      await fs.access(dataDir);
    } catch (error) {
      await fs.mkdir(dataDir, { recursive: true });
    }
    
    // Salvar arquivo
    await fs.writeFile(adminsPath, JSON.stringify([admin], null, 2));
    
    console.log('Administrador inicializado com sucesso!');
    console.log(`Usuário: ${admin.username}`);
    console.log(`Senha: ${senha}`);
    console.log('Arquivo salvo em:', adminsPath);
    
  } catch (error) {
    console.error('Erro ao inicializar administrador:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  inicializarAdmin();
}

module.exports = { inicializarAdmin }; 