import { useState } from "react";
import { OccasionKey } from "../lib/occasions";

export function useMessage() {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [occasion, setOccasion] = useState<OccasionKey>("noel");
  const [tone, setTone] = useState("joyeux");
  const [message, setMessage] = useState("");

  function generateShareUrl() {
    const params = new URLSearchParams({
      from: sender,
      to: recipient,
      event: occasion,
      tone,
      msg: message,
    });

    return `${window.location.origin}/view?${params.toString()}`;
  }

  return {
    sender,
    recipient,
    occasion,
    tone,
    message,
    setSender,
    setRecipient,
    setOccasion,
    setTone,
    setMessage,
    generateShareUrl,
  };
}
