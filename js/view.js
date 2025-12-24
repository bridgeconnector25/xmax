const p = new URLSearchParams(location.search);
const from = p.get("from");
const to = p.get("to");
const intent = p.get("intent");

const texts = {
  affection: [
    "Prends juste quelques secondes…",
    "Quelqu’un a pensé à toi sincèrement.",
    `${from} te souhaite un Noël doux et lumineux.`
  ],
  attirance: [
    "Ce message n’est pas arrivé par hasard.",
    "Certaines pensées sont silencieuses…",
    `${from} pensait à toi en ce moment précis.`
  ],
  reconnaissance: [
    "On oublie souvent de dire merci.",
    "Mais certaines personnes comptent vraiment.",
    `${from} voulait te le rappeler ce Noël.`
  ]
};

const themes = {
  affection: "linear-gradient(120deg,#0f2027,#203a43,#2c5364)",
  attirance: "linear-gradient(120deg,#41295a,#2F0743)",
  reconnaissance: "linear-gradient(120deg,#2c3e50,#f1c40f)"
};

document.body.style.background = themes[intent];

const lines = texts[intent];
["l1","l2","l3"].forEach((id,i)=>{
  setTimeout(()=>{
    document.getElementById(id).textContent = lines[i];
    document.getElementById(id).classList.add("show");
  }, i * 2500);
});

const audio = document.getElementById("audio");
audio.src = `assets/${intent}.mp3`;
document.body.onclick = () => audio.play();

document.getElementById("share").onclick = () => {
  const text = `🎄 Quelqu’un a pensé à toi...\n\nOuvre doucement 👇\n${location.href}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
};

document.getElementById("qr").src =
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(location.href)}`;

const christmas = new Date("December 25, 2025 00:00:00").getTime();
setInterval(()=>{
  const d = Math.max(0, Math.floor((christmas-Date.now())/(1000*60*60*24)));
  document.getElementById("countdown").textContent =
    `Encore ${d} jour${d>1?"s":""} avant Noël`;
},1000);

/* neige subtile */
const c = document.getElementById("snow"), ctx = c.getContext("2d");
c.width = innerWidth; c.height = innerHeight;
const flakes = Array.from({length:40},()=>({
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
