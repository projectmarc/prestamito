/**
 * Calcula la cuota mensual a cobrar (Sistema Directo)
 * Fórmula: (Capital / Plazo) + (Capital * (Tasa / 100))
 */
export function calculateMonthlyInstallment(capital, rate, months) {
    if (!capital || capital <= 0) return 0;
    const rateDecimal = rate / 100;
    return (capital / months) + (capital * rateDecimal);
}

/**
 * Calcula el retorno total esperado
 * Fórmula: Cuota mensual * Plazo
 */
export function calculateTotalReturn(monthlyInstallment, months) {
    return monthlyInstallment * months;
}

/**
 * Calcula el rendimiento acumulado en porcentaje
 * Fórmula: Tasa * Plazo
 */
export function calculateCumulativeYield(rate, months) {
    return rate * months;
}