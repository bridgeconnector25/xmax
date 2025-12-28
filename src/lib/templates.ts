import { OccasionKey } from "./occasions";

type Tone = "joyeux" | "amour" | "amitie" | "spirituel";

export const templates: Record<OccasionKey, Record<Tone, string>> = {
  noel: {
    joyeux: "Je te souhaite un merveilleux Noël rempli de joie 🎄",
    amour: "En ce Noël, je voulais te dire combien tu comptes ❤️",
    amitie: "Un très joyeux Noël à toi 🤍",
    spirituel: "Que la paix de Noël remplisse ton cœur ✨",
  },
  anniversaire: {
    joyeux: "Joyeux anniversaire 🎉",
    amour: "Tout mon amour en ce jour spécial ❤️",
    amitie: "Bon anniversaire mon ami 🎂",
    spirituel: "Que cette nouvelle année de vie t’élève ✨",
  },
  nouvel_an: {
    joyeux: "Bonne année 🎆",
    amour: "Une année pleine d’amour pour toi ❤️",
    amitie: "Très belle année à venir 🎊",
    spirituel: "Que cette année t’apporte lumière et paix ✨",
  },
  saint_valentin: {
    joyeux: "Joyeuse Saint-Valentin 💖",
    amour: "Mon cœur pense à toi ❤️",
    amitie: "Belle Saint-Valentin 🤍",
    spirituel: "Que l’amour guide ton cœur ✨",
  },
};
