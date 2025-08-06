const fs = require('fs').promises;
const path = require('path');

/**
 * Garante que o arquivo de dados existe, criando-o se necessário
 * @param {string} filename - Nome do arquivo (ex: 'reservas.json', 'admins.json')
 * @param {any} defaultContent - Conteúdo padrão para o arquivo (ex: [] para arrays)
 * @returns {Promise<any>} - Conteúdo do arquivo
 */
const garantirArquivoExiste = async (filename, defaultContent = []) => {
  try {
    const dataPath = path.join(__dirname, '../data');
    const filePath = path.join(dataPath, filename);
    
    // Criar diretório data se não existir
    try {
      await fs.access(dataPath);
    } catch {
      await fs.mkdir(dataPath, { recursive: true });
    }
    
    // Verificar se arquivo existe
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch {
      // Arquivo não existe, criar com conteúdo padrão
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
      return defaultContent;
    }
  } catch (error) {
    console.error(`Erro ao garantir existência do arquivo ${filename}:`, error);
    throw error;
  }
};

/**
 * Salva dados em um arquivo JSON
 * @param {string} filename - Nome do arquivo
 * @param {any} data - Dados para salvar
 */
const salvarDados = async (filename, data) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Erro ao salvar dados em ${filename}:`, error);
    throw error;
  }
};

module.exports = {
  garantirArquivoExiste,
  salvarDados
}; 