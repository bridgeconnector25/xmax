export default function MessageCard({ msg, from }: any) {
  return (
    <div className="bg-white/10 p-6 rounded-xl max-w-md text-center space-y-4">
      <p className="text-lg">{msg}</p>
      <p className="opacity-70">— {from}</p>
      <a href="/" className="btn-secondary block mt-4">Créer le tien</a>
    </div>
  );
}
