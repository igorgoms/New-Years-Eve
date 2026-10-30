/*==============================================================
   New Years Eve - Countdown Timer
   Lógica Dinâmica e Efeito Sutil de Neve
==============================================================*/

// Seleção dos elementos do cronômetro (preservando nomes originais)
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins");
const secondsEl = document.getElementById("seconds");
const targetYearEl = document.getElementById("target-year");

/**
 * Retorna dinamicamente a data do próximo Réveillon (1º de Janeiro do próximo ano)
 * Isso impede que o cronômetro expire ou mostre números negativos.
 */
function getNextNewYearDate() {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;
    return new Date(nextYear, 0, 1, 0, 0, 0);
}

/**
 * Formata números com zero à esquerda se menor que 10
 */
function formatTime(time) {
    return time < 10 ? `0${time}` : String(time);
}

/**
 * Função principal de contagem regressiva
 */
function countdown() {
    const targetDate = getNextNewYearDate();
    const currentDate = new Date();

    // Diferença em segundos (nunca menor que zero)
    const diffMs = targetDate - currentDate;
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    if (daysEl) daysEl.innerHTML = days;
    if (hoursEl) hoursEl.innerHTML = formatTime(hours);
    if (minsEl) minsEl.innerHTML = formatTime(mins);
    if (secondsEl) secondsEl.innerHTML = formatTime(seconds);

    if (targetYearEl) {
        if (totalSeconds === 0) {
            targetYearEl.innerHTML = "🎉 FELIZ ANO NOVO! 🎆";
        } else {
            targetYearEl.innerHTML = `Contagem para 1º de Janeiro de ${targetDate.getFullYear()}`;
        }
    }
}

// Chamada inicial e atualização a cada segundo
countdown();
setInterval(countdown, 1000);

/*======= Efeito de Neve Suave em Canvas =======*/
(function initSnow() {
    const canvas = document.getElementById("snow-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Quantidade de flocos equilibrada para não pesar
    const flakeCount = Math.min(50, Math.floor(window.innerWidth / 25));
    const flakes = [];

    for (let i = 0; i < flakeCount; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.2 + 0.8,
            alpha: Math.random() * 0.6 + 0.2,
            speedY: Math.random() * 0.7 + 0.3,
            speedX: Math.random() * 0.4 - 0.2,
            density: Math.random() * flakeCount,
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < flakes.length; i++) {
            const f = flakes[i];
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${f.alpha})`;
            ctx.fill();

            f.y += f.speedY;
            f.x += Math.sin(f.density) * 0.3 + f.speedX;

            // Retorna ao topo ao atingir o final da tela
            if (f.y > height) {
                f.y = -5;
                f.x = Math.random() * width;
            }
            if (f.x > width + 5) f.x = -5;
            if (f.x < -5) f.x = width + 5;
        }

        requestAnimationFrame(render);
    }

    render();
})();
