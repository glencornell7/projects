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
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-16">End-to-End Flow</h2>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 flex-1">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex-1 bg-[#1e1e1e] p-6 rounded-lg border-l-4 border-[#00E3E3] flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: index * 0.4,
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[#00E3E3] text-[#121212] flex items-center justify-center font-bold mb-4">
              {index + 1}
            </div>
            <p className="text-lg">{item}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
