import React from 'react';
import { motion } from "framer-motion";

export default function Envelope({ to, from, onOpen }: any) {
  return (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white/10 p-6 rounded-xl text-center">
      <p>Pour : {to}</p>
      <p>De : {from}</p>
      <button className="btn-primary mt-4" onClick={onOpen}>Ouvrir</button>
    </motion.div>
  );
}
