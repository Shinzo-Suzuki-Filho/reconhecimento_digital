const appState = {
    isScanning: false,
    scanTimer: null,
};

// Mock Database
const DATABASE = [
    {
        name: "CARLOS 'O PADRE' MENDES",
        cpf: "XXX.421.889-XX",
        status: "PROCURADO",
        crime: "Tráfico Interestadual / Homicídio",
        org: "PC-SP / INTERPOL",
        risk: "ALTA PERICULOSIDADE",
        emoji: "😠"
    },
    {
        name: "FERNANDA 'VIBORA' SILVA",
        cpf: "XXX.111.234-XX",
        status: "FORAGIDA",
        crime: "Estelionato / Lavagem de Dinheiro",
        org: "PF - BRASÍLIA",
        risk: "MÉDIA",
        emoji: "😒"
    },
    {
        name: "JOÃO DA CRUZ",
        cpf: "XXX.555.777-XX",
        status: "LIMPO",
        crime: "---",
        org: "---",
        risk: "BAIXA",
        emoji: "😐"
    },
    {
        name: "UNKNOWN_SUBJECT_404",
        cpf: "---",
        status: "NÃO ENCONTRADO",
        crime: "---",
        org: "---",
        risk: "---",
        emoji: "❓"
    }
];

// Elements
const scannerBtn = document.getElementById('scanner-btn');
const scanText = document.getElementById('scan-text');
const scannerScreen = document.getElementById('scanner-screen');
const processingScreen = document.getElementById('processing-screen');
const resultScreen = document.getElementById('result-screen');
const consoleLog = document.getElementById('console-log');

// Sound Effects (Web Audio API or simple implementation)
// For simplicity in this demo, we'll just use visual cues.

// Events
scannerBtn.onpointerdown = startScan;
scannerBtn.onpointerup = stopScan;
scannerBtn.onpointerleave = stopScan; // Verify if finger slides off
// Touch support
scannerBtn.ontouchstart = (e) => { e.preventDefault(); startScan(); };
scannerBtn.ontouchend = (e) => { e.preventDefault(); stopScan(); };


function startScan() {
    if (appState.isScanning) return;
    appState.isScanning = true;
    
    // Add visual feedback
    scannerBtn.classList.add('scanning');
    scanText.innerText = "LENDO BIOMETRIA...";
    scanText.style.color = "#fff";

    // Simulate scan time
    let progress = 0;
    appState.scanTimer = setInterval(() => {
        progress += 10;
        if (progress >= 100) {
            clearInterval(appState.scanTimer);
            scanComplete();
        }
    }, 200); // 2 seconds to scan
}

function stopScan() {
    if (!appState.isScanning) return;
    
    // If released too early
    clearInterval(appState.scanTimer);
    appState.isScanning = false;
    scannerBtn.classList.remove('scanning');
    scanText.innerText = "FALHA NA LEITURA";
    scanText.style.color = "var(--alert-color)";
    
    setTimeout(() => {
        if (!appState.isScanning) {
            scanText.innerText = "AGUARDANDO...";
            scanText.style.color = "var(--primary-color)";
        }
    }, 1000);
}

function scanComplete() {
    appState.isScanning = false;
    scannerBtn.classList.remove('scanning');
    
    // Switch screens
    scannerScreen.classList.add('hidden');
    processingScreen.classList.remove('hidden');
    
    startProcessingSimulation();
}

function startProcessingSimulation() {
    const logs = [
        "Conectando ao mainframe da PF...",
        "Autenticando credenciais do agente...",
        "Codificando imagem biométrica...",
        "Enviando hash ABX-99...",
        "Consultando banco de dados nacional...",
        "Comparando padrões de arco e laço...",
        "Recebendo dados..."
    ];

    let i = 0;
    consoleLog.innerHTML = "";
    
    const interval = setInterval(() => {
        if (i < logs.length) {
            const p = document.createElement('p');
            p.innerText = `> ${logs[i]}`;
            consoleLog.appendChild(p);
            consoleLog.scrollTop = consoleLog.scrollHeight;
            i++;
        } else {
            clearInterval(interval);
            setTimeout(showResult, 800);
        }
    }, 600);
}

function showResult() {
    // Pick a random result
    const randomIndex = Math.floor(Math.random() * DATABASE.length);
    const person = DATABASE[randomIndex];
    
    processingScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    // Build HTML based on result
    const isDangerous = person.status !== "LIMPO" && person.status !== "NÃO ENCONTRADO";
    const statusClass = isDangerous ? "danger" : "clean";
    
    resultScreen.innerHTML = `
        <div class="result-card ${statusClass}">
            <div class="mugshot">${person.emoji}</div>
            <div class="match-status">${person.status}</div>
            
            <div class="info-grid">
                <div class="info-item">
                     <label>NOME COMPLETO</label>
                     <div>${person.name}</div>
                </div>
                <div class="info-item">
                     <label>CPF/IDENTIFICAÇÃO</label>
                     <div>${person.cpf}</div>
                </div>
                ${isDangerous ? `
                <div class="info-item" style="color: var(--alert-color)">
                     <label>CRIMES ASSOCIADOS</label>
                     <div>${person.crime}</div>
                </div>
                <div class="info-item">
                     <label>MANDADO POR</label>
                     <div>${person.org}</div>
                </div>
                 <div class="info-item">
                     <label>NÍVEL DE RISCO</label>
                     <div>${person.risk}</div>
                </div>
                ` : ''}
            </div>

            <button class="reset-btn" onclick="resetApp()">NOVA CONSULTA</button>
        </div>
    `;
}

// Global function for the HTML button
window.resetApp = function() {
    resultScreen.classList.add('hidden');
    scannerScreen.classList.remove('hidden');
    scanText.innerText = "AGUARDANDO...";
    scanText.style.color = "var(--primary-color)";
};
