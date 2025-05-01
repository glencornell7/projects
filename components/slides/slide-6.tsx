"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function Slide6() {
  const [dividerPosition, setDividerPosition] = useState(50)

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Try Big Swings Safely</h2>

      <motion.div
        className="flex-1 flex flex-col md:flex-row relative bg-[#1e1e1e] rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="absolute top-0 bottom-0 w-1 bg-[#00E3E3] z-10 cursor-ew-resize"
          style={{ left: `${dividerPosition}%` }}
          initial={{ left: "50%" }}
          animate={{ left: `${dividerPosition}%` }}
          transition={{ duration: 2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0}
          onDrag={(_, info) => {
            const newPosition = Math.max(30, Math.min(70, dividerPosition + info.delta.x / 10))
            setDividerPosition(newPosition)
          }}
        />

        <div className="flex-1 overflow-hidden" style={{ width: `${dividerPosition}%` }}>
          <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a] overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4sokIhoT2ow2l8PU9fSHpH5uEvt2yU.png"
              alt="Original project showing Organizing Around Outcomes framework"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden" style={{ width: `${100 - dividerPosition}%` }}>
          <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a] overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Tk2k1CtekxMiazqpJEKle1vUsc8Z8k.png"
              alt="Forked variant with highlighted new concepts and features"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-center mt-4 text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        Fork → test → cherry-pick winners.
      </motion.p>
    </div>
  )
}
