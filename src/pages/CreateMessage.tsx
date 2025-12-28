import { useMessage } from "../hooks/useMessage";
import { templates } from "../lib/templates";
import { occasions } from "../lib/occasions";

export default function CreateMessage() {
  const msg = useMessage();

  function handleShare() {
    const url = msg.generateShareUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent("🎁 Un message pour toi 👇\n" + url)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">Créer un message</h1>

        <input className="input" placeholder="Ton prénom" onChange={e => msg.setSender(e.target.value)} />
        <input className="input" placeholder="Destinataire" onChange={e => msg.setRecipient(e.target.value)} />

        <select className="input" onChange={e => msg.setOccasion(e.target.value as any)}>
          {Object.entries(occasions).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>

        <select
          className="input"
          onChange={e => {
            msg.setTone(e.target.value);
            msg.setMessage(templates[msg.occasion][e.target.value as any]);
          }}
        >
          <option value="joyeux">Joyeux</option>
          <option value="amour">Amour</option>
          <option value="amitie">Amitié</option>
          <option value="spirituel">Spirituel</option>
        </select>

        <textarea
          className="input h-28"
          value={msg.message}
          onChange={e => msg.setMessage(e.target.value)}
        />

        <button onClick={handleShare} className="btn-primary">
          Partager sur WhatsApp
        </button>
      </div>
    </div>
  );
}
