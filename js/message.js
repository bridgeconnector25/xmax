const params = new URLSearchParams(location.search);

const from = params.get("from");
const to = params.get("to");
const msg = params.get("msg");

document.getElementById("to").textContent = `Pour toi, ${to} 💫`;
document.getElementById("msg").textContent = msg;
document.getElementById("from").textContent = `— De la part de ${from}`;
