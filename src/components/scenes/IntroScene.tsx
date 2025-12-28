import React from 'react';
import { motion } from "framer-motion";

export default function IntroScene({ from, onNext }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4">
      <p className="text-lg">🎁 {from} t’a envoyé un message</p>
      <button className="btn-primary" onClick={onNext}>Découvrir</button>
    </motion.div>
  );
}
