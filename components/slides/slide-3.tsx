"use client"

import { motion } from "framer-motion"

export default function Slide3() {
  const bullets = ["Goals", "Constraints", "Must-Have Features"]

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-12">Step 1 — Load the Brain</h2>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        <motion.div
          className="flex-1 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className="text-xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Drop chats, docs, PRDs. Ask ChatGPT to condense and tag themes.
          </motion.p>

          <h3 className="text-lg font-semibold mb-4">Sample tags:</h3>
          <ul className="space-y-3">
            {bullets.map((bullet, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.8 + index * 0.3,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#00E3E3]"></span>
                <span>{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="flex-1 flex items-center justify-center bg-[#1e1e1e] rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RHhHSY3hlNiuvWvKPYiHFCI4mA7qBM.png"
              alt="Chat interface showing uploaded PDF transcript and PRD documents"
              className="w-[55%] h-auto object-contain rounded-lg"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
