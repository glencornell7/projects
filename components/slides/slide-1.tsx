"use client"

import { motion } from "framer-motion"

export default function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-6 text-center"
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
        className="text-xl md:text-2xl text-gray-300 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 2.5,
        }}
      >
        From raw context to deployed demo in &lt;15 minutes
      </motion.h2>
    </div>
  )
}
