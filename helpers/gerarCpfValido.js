const gerarCpfValido = () => {
    // Gera os 9 primeiros dígitos (não pode ser todos iguais)
    const geraNoveDigitos = () => {
        let nums;
        do {
            nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
        } while (nums.every(n => n === nums[0]));
        return nums;
    };

    const calcDigito = (nums, pesoInicial) => {
        const soma = nums.reduce((acc, num, i) => acc + num * (pesoInicial - i), 0);
        const resto = soma % 11;
        const dig = 11 - resto;
        return dig >= 10 ? 0 : dig;
    };

    const base = geraNoveDigitos();
    const d1 = calcDigito(base, 10);
    const d2 = calcDigito([...base, d1], 11);

    return [...base, d1, d2].join("");
};

module.exports = {
    gerarCpfValido
}



