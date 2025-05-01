"use client"

import { motion } from "framer-motion"

export default function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* Customer.io logo */}
      <div className="absolute top-8 left-8">
        <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L0 12L12 24L24 12L12 0Z" fill="#D5F6C3" />
          <path d="M36 12L24 24L36 36L48 24L36 12Z" fill="#D5F6C3" opacity="0.8" />
        </svg>
      </div>

      <motion.h1
        className="text-5xl md:text-6xl font-semibold mb-6 text-center text-[#D5F6C3] z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          staggerChildren: 0.05,
          delayChildren: 0.1,
        }}
      >
        {Array.from("Rapid Prototyping with ChatGPT + Vercel V0").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 2 / "Rapid Prototyping with ChatGPT + Vercel V0".length,
              delay: index * (2 / "Rapid Prototyping with ChatGPT + Vercel V0".length),
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      <motion.h2
        className="text-xl md:text-2xl text-[#D5F6C3]/80 text-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 2.5,
        }}
      >
        From raw context to deployed demo in &lt;15 minutes
      </motion.h2>

      {/* Geometric pattern */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 z-0">
        <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 150L150 0L300 150L150 300L0 150Z" stroke="#D5F6C3" strokeOpacity="0.3" strokeWidth="2" />
          <path d="M150 0L300 150L150 300" stroke="#D5F6C3" strokeOpacity="0.5" strokeWidth="2" />
        </svg>
      </div>

      {/* Small logo in bottom right */}
      <div className="absolute bottom-8 right-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L0 12L12 24L24 12L12 0Z" fill="#D5F6C3" />
        </svg>
      </div>
    </div>
  )
}
