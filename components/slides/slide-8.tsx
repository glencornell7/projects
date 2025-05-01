"use client"

import { motion } from "framer-motion"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

export default function Slide8() {
  const steps = [
    "Connect GitHub repo in V0",
    "Enable Vercel Storage",
    "Add custom domain (glencornell.com)",
    'Hit "Deploy"',
  ]

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">One-Click Deploy via GitHub + Domains</h2>

      <div className="flex-1 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <ul className="space-y-6">
            {steps.map((step, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full bg-[#00E3E3] text-[#121212] flex items-center justify-center font-bold shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 10,
                    delay: index * 0.3 + 0.2,
                  }}
                >
                  {index + 1}
                </motion.div>
                <span className="text-lg pt-1">{step}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="flex-1 flex items-center justify-center bg-[#1e1e1e] rounded-lg p-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="w-full h-64 bg-[#2a2a2a] rounded-lg flex items-center justify-center overflow-hidden">
            <PlaceholderImage
              query="deployment workflow diagram showing GitHub and domain setup"
              alt="Domain flow diagram"
              width={600}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
