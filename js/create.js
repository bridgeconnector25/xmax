const messages = [
  "Je te souhaite un Noël rempli de paix et de lumière ✨",
  "Que ce Noël t’apporte douceur, joie et sérénité 🎁",
  "Un petit message pour te souhaiter un merveilleux Noël 🎄",
  "Que la magie de Noël éclaire ton cœur ❤️"
];

document.getElementById("share").onclick = () => {
  const from = document.getElementById("from").value.trim();
  const to = document.getElementById("to").value.trim();

  if (!from || !to) {
    alert("Merci de remplir les deux noms.");
    return;
  }

  const message = messages[Math.floor(Math.random() * messages.length)];

  const url =
    `${location.origin}${location.pathname.replace("index.html","")}message.html` +
    `?from=${encodeURIComponent(from)}` +
    `&to=${encodeURIComponent(to)}` +
    `&msg=${encodeURIComponent(message)}`;

  const whatsappText =
    `🎄 *Message de Noël*\n\n` +
    `Quelqu’un t’a laissé un message spécial 👇\n\n${url}`;

  window.open(
    `https://wa.me/?text=${encodeURIComponent(whatsappText)}`,
    "_blank"
  );
};
