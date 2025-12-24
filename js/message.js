const params = new URLSearchParams(location.search);
const fromName = params.get("from");
const toName = params.get("to");
const msg = params.get("msg");
const event = params.get("event");
const musicOn = params.get("music") === "true";

document.getElementById("msg").textContent = msg;
document.getElementById("from").textContent = `— De la part de ${fromName}`;

// musique
const audio = document.getElementById("audio");
const musicFiles = {
  noel: "assets/music_noel.mp3",
  anniversaire: "assets/music_anniversaire.mp3",
  nouvel_an: "assets/music_nouvel_an.mp3",
  saint_valentin: "assets/music_saint_valentin.mp3"
};
audio.src = musicFiles[event];
if (musicOn) audio.play();

// neige
const c = document.getElementById("snow"), ctx = c.getContext("2d");
c.width = innerWidth; c.height = innerHeight;
const flakes = Array.from({length:50},()=>({
  x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+1,d:Math.random()+0.5
}));
(function snow(){
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle="rgba(255,255,255,.4)";
  flakes.forEach(f=>{
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fill();
    f.y+=f.d;
    if(f.y>c.height) f.y=0;
  });
  requestAnimationFrame(snow);
})();

// scintillements
const sparkle = document.createElement("div");
sparkle.className="sparkle";
document.body.appendChild(sparkle);
