"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export default function Slide7() {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">When Something Breaks… Just tell v0 to "fix it"</h2>

      <div className="flex-1 flex flex-col gap-6">
        {/* Error Card */}
        <motion.div
          className="flex-1 bg-[#1e1e1e] rounded-lg p-4 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0 * 0.2,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#00E3E3] text-[#121212] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold">Error</h3>
          </div>

          <div className="w-full h-32 bg-[#f1f1f1] rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-C33ym.png"
              alt="Error message: This page doesn't exist"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Steps 2 and 3 side by side */}
        <div className="flex flex-row gap-6">
          {/* Prompt Card */}
          <motion.div
            className="flex-1 bg-[#1e1e1e] rounded-lg p-4 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1 * 0.2,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#00E3E3] text-[#121212] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold">Prompt</h3>
            </div>

            <div className="w-full h-32 bg-[#2a2a2a] rounded-lg flex items-center justify-center p-4">
              <p className="text-gray-200 italic">"Something broke - please fix it"</p>
            </div>
          </motion.div>

          {/* Success Card */}
          <motion.div
            className="flex-1 bg-[#1e1e1e] rounded-lg p-4 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 2 * 0.2,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#00E3E3] text-[#121212] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold">Success</h3>
            </div>

            <div className="w-full h-32 bg-[#2a2a2a] rounded-lg flex items-center justify-center overflow-hidden">
              <div className="bg-[#121212] text-white p-4 rounded-lg w-full max-w-md text-center">
                <p className="text-lg font-medium">Page loaded successfully!</p>
                <p className="text-sm text-gray-400 mt-2">All errors fixed</p>
              </div>
            </div>

            <motion.div
              className="absolute -right-2 -top-2 text-green-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 10,
                delay: 1,
              }}
            >
              <CheckCircle size={32} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
