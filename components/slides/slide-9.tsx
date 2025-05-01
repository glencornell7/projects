"use client"

import { motion } from "framer-motion"

export default function Slide9() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Use the Deployed Site as Context</h2>

      <motion.p
        className="text-xl mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Point new ChatGPT sessions at your deployed site → richer, up-to-date answers.
      </motion.p>

      <motion.div
        className="flex-1 bg-[#1e1e1e] rounded-lg p-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-aQcKIDqV4AcX9Yg9TSAsqhl8vxCMzn.png"
            alt="ChatGPT conversation showing feedback on a deployed website"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      </motion.div>
    </div>
  )
}
