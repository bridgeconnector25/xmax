import { useSearchParams } from "react-router-dom";
import IntroScene from "../components/scenes/IntroScene";
import Envelope from "../components/Envelope";
import MessageCard from "../components/MessageCard";
import { useState } from "react";

export default function ViewMessage() {
  const [params] = useSearchParams();
  const [step, setStep] = useState<"intro" | "envelope" | "message">("intro");

  const data = {
    from: params.get("from") || "Un ami",
    to: params.get("to") || "Toi",
    msg: params.get("msg") || "",
    event: params.get("event") || "noel",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white flex items-center justify-center">
      {step === "intro" && <IntroScene from={data.from} onNext={() => setStep("envelope")} />}
      {step === "envelope" && <Envelope to={data.to} from={data.from} onOpen={() => setStep("message")} />}
      {step === "message" && <MessageCard {...data} />}
    </div>
  );
}
