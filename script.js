// 1. Récupérer le nom dans l'URL (?n=Nom)
const urlParams = new URLSearchParams(window.location.search);
const nameInUrl = urlParams.get('n') || "Un ami";
document.getElementById('sender-name').innerText = nameInUrl.replace(/-/g, ' ');

// 2. Compte à rebours pour Noël (25 Déc 2025)
function updateCountdown() {
    const now = new Date().getTime();
    const target = new Date('Dec 25, 2025 00:00:00').getTime();
    const diff = target - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    document.getElementById('countdown').innerHTML = `Noël dans : ${days}j ${hours}h`;
}
setInterval(updateCountdown, 1000);

// 3. Fonction de partage WhatsApp
function shareOnWhatsApp() {
    const name = document.getElementById('userName').value;
    if (!name) return alert("Veuillez entrer votre nom");

    const cleanName = name.trim().replace(/\s+/g, '-');
    const baseUrl = window.location.href.split('?')[0]; // URL de base du site
    const shareUrl = `${baseUrl}?n=${cleanName}`;
    
    const message = `😳 Regarde cette surprise ! *${name}* t'envoie un message magique : ${shareUrl}`;
    window.open(`wa.me{encodeURIComponent(message)}`, '_blank');
}
