"use client"

import { motion } from "framer-motion"

export default function Slide5() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Step 3 — Let V0 Draft, Then Nudge</h2>

      <div className="flex-1 relative bg-[#1e1e1e] rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-eCB3f3DikPPQ4RZQzRUYsAFj347189.png"
            alt="V0 code editor interface showing React component code"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-lg">
            <span className="text-green-400">✅ Keep the good bits</span> →
            <span className="text-[#00E3E3]"> 🔄 'Redo' for off-spec parts</span> →
            <span className="text-red-400"> 🗑️ delete noise</span>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
