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
    <div className="flex flex-col h-full relative">
      <h2 className="text-4xl font-semibold mb-12 text-center text-[#D5F6C3]">Key Takeaways</h2>

      <motion.ul
        className="space-y-6 max-w-2xl mx-auto z-10"
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
            <span className="text-[#D5F6C3]">•</span>
            <span>{bullet}</span>
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        className="mt-auto flex justify-center z-10"
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
        <button className="bg-[#D5F6C3] text-[#0A3538] px-6 py-3 rounded-lg font-medium hover:bg-[#D5F6C3]/80 transition-colors">
          Clone this deck on V0
        </button>
      </motion.div>

      {/* Geometric pattern */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 z-0 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 150L150 0L300 150L150 300L0 150Z" stroke="#D5F6C3" strokeWidth="2" />
          <path d="M150 0L300 150L150 300" stroke="#D5F6C3" strokeWidth="2" />
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
