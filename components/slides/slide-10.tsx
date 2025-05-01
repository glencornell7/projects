"use client"

import { motion } from "framer-motion"

export default function Slide10() {
  const bullets = [
    "Start in ChatGPT to compress context",
    "Let V0 handle first pass UI",
    "Iterate fast—fork boldly, fix instantly",
    "Ship to a real domain for instant feedback",
  ]

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-12 text-center">Key Takeaways</h2>

      <motion.ul
        className="space-y-6 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {bullets.map((bullet, index) => (
          <motion.li
            key={index}
            className="flex items-center gap-3 text-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 * index }}
          >
            <span className="text-[#00E3E3]">•</span>
            <span>{bullet}</span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        className="mt-auto flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          type: "spring",
          stiffness: 500,
          damping: 10,
        }}
      >
        <button className="bg-[#00E3E3] text-[#121212] px-6 py-3 rounded-lg font-medium hover:bg-[#00E3E3]/80 transition-colors">
          Clone this deck on V0
        </button>
      </motion.div>
    </div>
  )
}
