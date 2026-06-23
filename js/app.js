import { 
    calculateMonthlyInstallment, 
    calculateTotalReturn, 
    calculateCumulativeYield 
} from './calculator.js';

// --- ELEMENTOS DEL DOM ---
const inputCapital = document.getElementById('capital');
const inputRate = document.getElementById('rate');
const resultsGrid = document.getElementById('results-grid');

// --- FORMATEADOR DE MONEDA ---
// Utilizando es-AR para representar el formato local (ej: $ 100.000,00)
const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

// --- LÓGICA DE INTERFAZ ---

function sanitizeCapitalInput(value) {
    // Elimina cualquier carácter que no sea dígito para forzar enteros positivos
    return value.replace(/\D/g, '');
}

function updateCalculator() {
    let capitalStr = inputCapital.value;
    
    // Validar y limpiar el input de capital en tiempo real (solo enteros positivos)
    const sanitizedCapitalStr = sanitizeCapitalInput(capitalStr);
    if (capitalStr !== sanitizedCapitalStr) {
        inputCapital.value = sanitizedCapitalStr;
    }

    const capital = parseInt(sanitizedCapitalStr, 10);
    const rate = parseFloat(inputRate.value);

    // Limpiar grid si no hay datos válidos
    if (isNaN(capital) || capital <= 0 || isNaN(rate)) {
        resultsGrid.innerHTML = '<div class="empty-state">Ingresa un capital válido para ver las opciones.</div>';
        return;
    }

    renderResults(capital, rate);
}

function renderResults(capital, rate) {
    // Fragmento para evitar múltiples repaints en el DOM
    const fragment = document.createDocumentFragment();

    for (let month = 1; month <= 12; month++) {
        const monthlyInstallment = calculateMonthlyInstallment(capital, rate, month);
        const totalReturn = calculateTotalReturn(monthlyInstallment, month);
        const cumulativeYield = calculateCumulativeYield(rate, month);

        const card = document.createElement('div');
        card.className = 'result-card';
        
        card.innerHTML = `
            <div class="card-header">En ${month} mes${month > 1 ? 'es' : ''}</div>
            
            <div class="card-main-data">
                <span>Cuota mensual a cobrar</span>
                <div class="amount">${currencyFormatter.format(monthlyInstallment)}</div>
            </div>
            
            <div class="card-secondary-data">
                <span>Retorno Total:</span>
                <strong>${currencyFormatter.format(totalReturn)}</strong>
            </div>
            
            <div class="card-secondary-data">
                <span>Rendimiento Acumulado:</span>
                <strong>${cumulativeYield.toFixed(2)}%</strong>
            </div>
        `;
        
        fragment.appendChild(card);
    }

    resultsGrid.innerHTML = ''; // Limpiar grid actual
    resultsGrid.appendChild(fragment);
}

// --- EVENT LISTENERS (Reactividad) ---
inputCapital.addEventListener('input', updateCalculator);
inputRate.addEventListener('input', updateCalculator);

// --- SERVICE WORKER REGISTRATION ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.error('Fallo al registrar el ServiceWorker:', error);
            });
    });
}