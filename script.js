const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

// Sichqonchaning boshlang'ich koordinatalari va ta'siri
let mouse = { x: width / 2, y: height / 2, speed: 1 };
let targetMouse = { x: width / 2, y: height / 2 };

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Sichqoncha harakatini kuzatish va tezlikni hisoblash
window.addEventListener('mousemove', (e) => {
  let dx = e.clientX - targetMouse.x;
  let dy = e.clientY - targetMouse.y;
  mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.1, 5); // Harakat tezligi
  
  targetMouse.x = e.clientX;
  targetMouse.y = e.clientY;
});

// Indikator elementlari
const speedIndicator = document.getElementById('speed-indicator');
const colorIndicator = document.getElementById('color-indicator');

let increment = 0;
let hueOffset = 0;

function animate() {
  requestAnimationFrame(animate);

  // Sichqoncha koordinatasiga silliq (smooth) yetib borish
  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;

  // Harakat to'xtaganda tezlikni sekin kamaytirish
  mouse.speed += (1 - mouse.speed) * 0.05;

  // UI dagi yozuvlarni dinamik yangilash
  if(mouse.speed > 2.5) {
    speedIndicator.textContent = "Tezlik: Juda Yuqori 🔥";
    speedIndicator.style.color = "#ff007f";
  } else {
    speedIndicator.textContent = "Tezlik: Normal ⚡";
    speedIndicator.style.color = "#4f5875";
  }

  // Fonni ozgina shaffof qora bilan bo'yash (bu to'lqinlar ortidan chiroyli iz qoldiradi)
  ctx.fillStyle = 'rgba(2, 2, 8, 0.08)';
  ctx.fillRect(0, 0, width, height);

  // Rang tonini sichqoncha joylashuviga qarab o'zgartirish
  hueOffset = (mouse.x / width) * 360;
  colorIndicator.textContent = `Rang Ton: ${Math.floor(hueOffset)}°`;

  // Bir nechta qatlamli to'lqinlar chizish (Har xil harakatlar uyg'unligi)
  const totalWaves = 5;
  for (let i = 0; i < totalWaves; i++) {
    ctx.beginPath();
    ctx.lineWidth = i === 0 ? 3 : 1.5; // Eng ustki to'lqin qalinroq

    // Ranglarni dinamik aralashtirish
    let currentHue = (hueOffset + i * 25) % 360;
    ctx.strokeStyle = `hsla(${currentHue}, 90%, 60%, ${0.15 + (i * 0.15)})`;
    ctx.shadowBlur = i === 0 ? 15 : 0;
    ctx.shadowColor = `hsl(${currentHue}, 90%, 60%)`;

    // To'lqin chizish algoritmi (Matematik Sinusoidal to'lqin)
    for (let x = 0; x < width; x += 10) {
      // Sichqonchaning Y o'qi to'lqin balandligiga (amplitude), X o'qi esa chastotasiga ta'sir qiladi
      let amplitude = (mouse.y * 0.3) / (i + 1) + 20;
      let frequency = 0.002 + (i * 0.002) + (mouse.x * 0.00001);
      
      // Sinus va Kosinus kombinatsiyasi orqali murakkab harakat yaratish
      let y = height / 2 + 
              Math.sin(x * frequency + increment + i) * amplitude +
              Math.cos(x * 0.005 - increment) * (amplitude * 0.5);

      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }

  // Animatsiya tezligini sichqoncha tezligiga qarab oshirish
  increment += 0.015 * (mouse.speed * 0.7);
}

// Ishga tushirish
animate();