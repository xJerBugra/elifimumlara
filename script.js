const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mum = document.getElementById("mum");
const elifText = document.getElementById("elif-text");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

// Fare ve dokunmatik hareketleri için
document.addEventListener("mousemove", moveMum);
document.addEventListener("touchmove", moveMum, { passive: false });

function moveMum(event) {
    let x, y;
    if (event.touches) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
        event.preventDefault();
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    mum.style.left = `${x - 50}px`;
    mum.style.top = `${y - 50}px`;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(x, y, 30, x, y, 200);
    gradient.addColorStop(0, "rgba(255, 255, 200, 0.6)");
    gradient.addColorStop(0.5, "rgba(255, 255, 150, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 200, y - 200, 400, 400);
    ctx.globalCompositeOperation = "source-over";

    const textRect = elifText.getBoundingClientRect();
    const textCenterX = textRect.left + textRect.width / 2;
    const textCenterY = textRect.top + textRect.height / 2;

    const distance = Math.hypot(x - textCenterX, y - textCenterY);
    elifText.style.opacity = distance < 150 ? 1 : 0;
}
