const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const mum = document.getElementById("mum");
const elifText = document.getElementById("elif-text");
const audio = document.getElementById("background-music");
const welcomeScreen = document.getElementById("welcome-screen");
const startButton = document.getElementById("start-button");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

let textVisible = false;  // Yazının ekranda olup olmadığını kontrol et
let isTextFound = false;  // Yazının bulunup bulunmadığını kontrol et
let targetX, targetY;  // Yazının hedef pozisyonu

// Oyunu başlat butonuna tıklama
startButton.addEventListener("click", startGame);

// Oyunu başlatma
function startGame() {
    // Hoş geldiniz ekranını gizle
    welcomeScreen.style.display = "none";
    
    // Oyun ekranını göster
    canvas.style.display = "block";
    mum.style.display = "block";
    elifText.style.display = "block";

    // Yazıyı rastgele bir konumda başlat
    moveTextRandomly();

    // Müziği başlat ve ses seviyesini çok düşük yap
    audio.play();
    audio.volume = 0.01; // Başlangıçta çok düşük ses seviyesi
}

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

    mum.style.left = `${x - 40}px`; // Mum ışığını biraz küçülttük
    mum.style.top = `${y - 40}px`; // Mum ışığını biraz küçülttük

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createRadialGradient(x, y, 30, x, y, 80); // Işık yayılan alanı kısalttık
    gradient.addColorStop(0, "rgba(255, 255, 200, 0.6)");
    gradient.addColorStop(0.5, "rgba(255, 255, 150, 0.3)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = gradient;
    ctx.fillRect(x - 150, y - 150, 300, 300); // Işığın yayılma mesafesini kısalttık
    ctx.globalCompositeOperation = "source-over";

    const textRect = elifText.getBoundingClientRect();
    const textCenterX = textRect.left + textRect.width / 2;
    const textCenterY = textRect.top + textRect.height / 2;

    const distance = Math.hypot(x - textCenterX, y - textCenterY);
    elifText.style.opacity = distance < 150 ? 1 : 0;

    // Işık yazıya yaklaşıp yazıyı görünür yaptıysa ve yazı daha önce bulunmadıysa
    if (!isTextFound && distance < 150) {
        isTextFound = true; // Yazı bulundu
        setTimeout(() => {
            moveTextRandomly(); // 2 saniye sonra yeni rastgele bir konuma taşı
            isTextFound = false; // Yazı tekrar bulunmaya hazır
        }, 500); // 2 saniye bekle
    }

    // Ses seviyesini mesafeye göre ayarla
    let volume = Math.max(0.01, Math.min(1, (500 - distance) / 500)); // Min ses seviyesi 0.1
    audio.volume = volume;
}

// Yazıyı rastgele bir konuma taşıma fonksiyonu
function moveTextRandomly() {
    targetX = Math.random() * (window.innerWidth - 100); // 100px padding
    targetY = Math.random() * (window.innerHeight - 100); // 100px padding

    elifText.style.left = `${targetX}px`;
    elifText.style.top = `${targetY}px`;

    // Yazı başlangıçta 1 saniye sabit kalsın
    setTimeout(() => {
        textVisible = true;
        elifText.style.opacity = 1; // Yazıyı görünür yap
    }, 500);  // 1 saniye bekle
}
