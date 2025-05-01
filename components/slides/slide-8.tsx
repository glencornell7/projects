"use client"

import { motion } from "framer-motion"
import { Github, Database, Globe, Rocket } from "lucide-react"

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
          className="flex-1 flex items-center justify-center bg-[#1e1e1e] rounded-lg p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <DeploymentAnimation />
        </motion.div>
      </div>
    </div>
  )
}

function DeploymentAnimation() {
  const iconSize = 48
  const iconColor = "#00E3E3"
  const arrowColor = "#555"

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* GitHub to Storage */}
      <motion.div
        className="absolute left-0 top-0"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <Github size={iconSize} color={iconColor} />
        </div>
      </motion.div>

      {/* Arrow 1 */}
      <motion.div
        className="absolute left-[25%] top-[15%] transform -rotate-45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <div className="w-16 h-1 bg-[#00E3E3]" />
        <div className="w-3 h-3 border-t-2 border-r-2 border-[#00E3E3] transform rotate-45 absolute right-0 top-[-3px]" />
      </motion.div>

      {/* Storage */}
      <motion.div
        className="absolute left-[40%] top-[30%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <Database size={iconSize} color={iconColor} />
        </div>
      </motion.div>

      {/* Arrow 2 */}
      <motion.div
        className="absolute left-[60%] top-[40%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.5 }}
      >
        <div className="w-16 h-1 bg-[#00E3E3]" />
        <div className="w-3 h-3 border-t-2 border-r-2 border-[#00E3E3] transform rotate-45 absolute right-0 top-[-3px]" />
      </motion.div>

      {/* Domain */}
      <motion.div
        className="absolute right-0 top-[50%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <Globe size={iconSize} color={iconColor} />
        </div>
      </motion.div>

      {/* Arrow 3 */}
      <motion.div
        className="absolute right-[25%] bottom-[30%] transform rotate-45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 2.3 }}
      >
        <div className="w-16 h-1 bg-[#00E3E3]" />
        <div className="w-3 h-3 border-t-2 border-r-2 border-[#00E3E3] transform rotate-45 absolute right-0 top-[-3px]" />
      </motion.div>

      {/* Deploy */}
      <motion.div
        className="absolute bottom-0 left-[40%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2.6 }}
      >
        <div className="bg-[#2a2a2a] p-4 rounded-lg">
          <Rocket size={iconSize} color={iconColor} />
        </div>
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            duration: 0.8,
            delay: 3.0,
          }}
        >
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold">✓</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Central connecting circle */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.0, delay: 3.0 }}
      >
        <div className="w-40 h-40 rounded-full border-2 border-[#00E3E3] bg-[#00E3E3]/10" />
      </motion.div>
    </div>
  )
}
