/*==============================================================
   New Years Eve - Countdown Timer & Efeitos Visuais
==============================================================*/

// Elementos originais do contador
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");

// Elementos visuais extras
const targetYearDisplay = document.getElementById("target-year-display");
const progressFill = document.getElementById("progress-fill");
const progressPercentage = document.getElementById("progress-percentage");
const progressLabel = document.getElementById("progress-label");
const quoteText = document.getElementById("quote-text");

// Lista de frases inspiradoras de Ano Novo
const quotes = [
    "Que o próximo ano traga novas oportunidades, grandes conquistas e momentos inesquecíveis.",
    "365 novas oportunidades para recomeçar, sonhar e vencer.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos.",
    "Que a virada do ano renove as esperanças e traga paz, amor e prosperidade.",
    "Um brinde ao que passou e aos novos começos que estão por vir!"
];

/**
 * Retorna dinamicamente a data do próximo Réveillon (1º de Janeiro do próximo ano)
 */
function getTargetDate() {
    const now = new Date();
    const currentYear = now.getFullYear();
    return new Date(currentYear + 1, 0, 1, 0, 0, 0);
}

/**
 * Formata números menores que 10 com zero à esquerda
 */
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

/**
 * Atualiza o cronômetro a cada segundo
 */
function countdown() {
    const targetDate = getTargetDate();
    const currentDate = new Date();

    const totalSeconds = (targetDate - currentDate) / 1000;

    // Se já virou o ano
    if (totalSeconds <= 0) {
        daysEl.innerHTML = "0";
        hoursEl.innerHTML = "00";
        minsEl.innerHTML = "00";
        secondsEl.innerHTML = "00";
        if (targetYearDisplay) {
            targetYearDisplay.innerHTML = "🎉 FELIZ ANO NOVO! 🎆";
        }
        return;
    }

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    if (daysEl) daysEl.innerHTML = days;
    if (hoursEl) hoursEl.innerHTML = formatTime(hours);
    if (minsEl) minsEl.innerHTML = formatTime(mins);
    if (secondsEl) secondsEl.innerHTML = formatTime(seconds);

    // Atualiza título do ano alvo
    if (targetYearDisplay && !targetYearDisplay.dataset.customized) {
        targetYearDisplay.textContent = `Rumo a 1º de Janeiro de ${targetDate.getFullYear()}`;
    }

    // Calcula progresso do ano atual
    atualizarProgressoAno(currentDate);
}

/**
 * Calcula e anima a barra de progresso do ano
 */
function atualizarProgressoAno(now) {
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);

    const percent = ((now - startOfYear) / (endOfYear - startOfYear)) * 100;
    const formattedPercent = Math.min(100, Math.max(0, percent)).toFixed(1);

    if (progressPercentage) {
        progressPercentage.textContent = `${formattedPercent}%`;
    }
    if (progressFill) {
        progressFill.style.width = `${formattedPercent}%`;
    }
    if (progressLabel) {
        progressLabel.textContent = `Ano de ${now.getFullYear()}:`;
    }
}

// Chamada inicial e intervalo regular
countdown();
setInterval(countdown, 1000);

/*======= Efeito de Neve Suave com Canvas =======*/
const canvas = document.getElementById("snow-canvas");
let snowAnimationId = null;
let snowEnabled = true;

if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const flakeCount = Math.min(65, Math.floor(window.innerWidth / 22));
    const flakes = [];

    for (let i = 0; i < flakeCount; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.8 + 1,
            density: Math.random() * flakeCount,
            alpha: Math.random() * 0.75 + 0.25,
            speedY: Math.random() * 0.8 + 0.4,
            speedX: Math.random() * 0.6 - 0.3,
        });
    }

    function renderSnow() {
        if (!snowEnabled) return;

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";

        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
            ctx.fill();

            // Movimento sutil
            f.y += f.speedY;
            f.x += Math.sin(f.density) * 0.4 + f.speedX;

            // Reinicia floco ao sair da tela
            if (f.y > height) {
                f.y = -5;
                f.x = Math.random() * width;
            }
            if (f.x > width + 5) f.x = -5;
            if (f.x < -5) f.x = width + 5;
        }

        snowAnimationId = requestAnimationFrame(renderSnow);
    }

    renderSnow();

    // Botão de alternar neve
    const toggleSnowBtn = document.getElementById("btn-toggle-snow");
    if (toggleSnowBtn) {
        toggleSnowBtn.addEventListener("click", () => {
            snowEnabled = !snowEnabled;
            if (snowEnabled) {
                toggleSnowBtn.innerHTML = "<span>❄️ Neve</span>";
                renderSnow();
            } else {
                toggleSnowBtn.innerHTML = "<span>🚫 Sem Neve</span>";
                ctx.clearRect(0, 0, width, height);
                cancelAnimationFrame(snowAnimationId);
            }
        });
    }
}

/*======= Botão para Alternar Imagem de Fundo de Gabriel =======*/
const toggleBgBtn = document.getElementById("btn-toggle-bg");
if (toggleBgBtn) {
    toggleBgBtn.addEventListener("click", () => {
        document.body.classList.toggle("bg-alt");
    });
}

/*======= Alternância Suave de Frases Inspiradoras =======*/
if (quoteText) {
    let quoteIndex = 0;
    setInterval(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteText.style.opacity = "0";
        setTimeout(() => {
            quoteText.textContent = `"${quotes[quoteIndex]}"`;
            quoteText.style.opacity = "1";
        }, 400);
    }, 9000);
    quoteText.style.transition = "opacity 0.4s ease";
}
