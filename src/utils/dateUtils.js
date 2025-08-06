const moment = require('moment');

/**
 * Verifica se uma data é válida e não é passada
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {boolean} - true se válida, false caso contrário
 */
function validarData(data) {
  const dataReserva = moment(data, 'YYYY-MM-DD', true);
  const hoje = moment().startOf('day');
  
  return dataReserva.isValid() && dataReserva.isSameOrAfter(hoje);
}

/**
 * Formata uma data para exibição
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {string} - Data formatada (DD/MM/YYYY)
 */
function formatarData(data) {
  return moment(data).format('DD/MM/YYYY');
}

/**
 * Obtém a data atual no formato YYYY-MM-DD
 * @returns {string} - Data atual
 */
function getDataAtual() {
  return moment().format('YYYY-MM-DD');
}

/**
 * Verifica se uma data é hoje
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {boolean} - true se for hoje, false caso contrário
 */
function ehHoje(data) {
  return moment(data).isSame(moment(), 'day');
}

/**
 * Verifica se uma data é futura
 * @param {string} data - Data no formato YYYY-MM-DD
 * @returns {boolean} - true se for futura, false caso contrário
 */
function ehFutura(data) {
  return moment(data).isAfter(moment(), 'day');
}

/**
 * Obtém o número de dias entre duas datas
 * @param {string} dataInicio - Data inicial
 * @param {string} dataFim - Data final
 * @returns {number} - Número de dias
 */
function diasEntreDatas(dataInicio, dataFim) {
  return moment(dataFim).diff(moment(dataInicio), 'days');
}

module.exports = {
  validarData,
  formatarData,
  getDataAtual,
  ehHoje,
  ehFutura,
  diasEntreDatas
}; 