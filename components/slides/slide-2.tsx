"use client"

import { motion } from "framer-motion"

export default function Slide2() {
  const timelineItems = [
    "Gather context in ChatGPT",
    "Generate first draft in V0",
    "Iterate / fork / fix",
    "Publish to custom domain",
  ]

  return (
    <div className="flex flex-col h-full relative">
      <h2 className="text-4xl font-semibold mb-16 text-[#D5F6C3]">End-to-End Flow</h2>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 flex-1 z-10">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex-1 bg-[#1D7D74]/20 p-6 rounded-lg border-l-4 border-[#D5F6C3] flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.4,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[#D5F6C3] text-[#0A3538] flex items-center justify-center font-bold mb-4">
              {index + 1}
            </div>
            <p className="text-lg text-white">{item}</p>
          </motion.div>
        ))}
      </div>

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
