const templates = {
  noel: {
    joyeux: "Je te souhaite un merveilleux Noël rempli de joie et de paix 🎄",
    amour: "En ce Noël, je voulais simplement te rappeler combien tu comptes ❤️",
    amitie: "Un petit message pour te souhaiter un très beau Noël 🤍",
    spirituel: "Que la paix et la lumière de Noël remplissent ton cœur ✨"
  },
  anniversaire: {
    joyeux: "Joyeux anniversaire ! Que cette journée soit exceptionnelle 🎉",
    amour: "Un anniversaire plein d'amour et de bonheur ❤️",
    amitie: "Bon anniversaire à un ami précieux 🎂",
    spirituel: "Que cette nouvelle année de vie t'apporte sagesse et lumière ✨"
  },
  nouvel_an: {
    joyeux: "Bonne année ! Que 2026 soit incroyable 🎆",
    amour: "Je te souhaite une année pleine d'amour et de bonheur ❤️",
    amitie: "Bonne année mon ami ! 🎊",
    spirituel: "Que cette nouvelle année t'apporte paix et clarté ✨"
  },
  saint_valentin: {
    joyeux: "Joyeuse Saint-Valentin ! 💖",
    amour: "Mon cœur pense à toi en ce jour ❤️",
    amitie: "Bonne Saint-Valentin à toi, ami précieux 🤍",
    spirituel: "Que l'amour et la bienveillance remplissent ton cœur ✨"
  }
};

const selectEvent = document.getElementById("eventType");
const selectTemplate = document.getElementById("template");
const textarea = document.getElementById("customMsg");

function updateMessage() {
  const event = selectEvent.value;
  const template = selectTemplate.value;
  textarea.value = templates[event][template];
}

selectEvent.onchange = updateMessage;
selectTemplate.onchange = updateMessage;
updateMessage();

document.getElementById("share").onclick = () => {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();
  const event = selectEvent.value;
  const msg = textarea.value.trim();
  const musicOn = document.getElementById("musicToggle").checked;

  if (!from || !to) { alert("Merci de remplir les deux noms."); return; }

  const url = `${location.origin}/message.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&event=${event}&msg=${encodeURIComponent(msg)}&music=${musicOn}`;

  const whatsappText = `🎁 Un message spécial pour toi 👇\n\n${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`);
};
