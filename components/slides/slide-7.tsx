"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { PlaceholderImage } from "@/components/ui/placeholder-image"

export default function Slide7() {
  const cards = [
    { title: "Error", content: "[asset:error.png]" },
    { title: "Prompt", content: "Something broke—please fix the JSX syntax." },
    { title: "Success", content: "[asset:fixed.png]", success: true },
  ]

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">When It Breaks… Tell V0</h2>

      <div className="flex-1 flex flex-col gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="flex-1 bg-[#1e1e1e] rounded-lg p-4 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.2,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#00E3E3] text-[#121212] flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>

            {index === 0 && (
              <div className="w-full h-32 bg-[#2a2a2a] rounded-lg flex items-center justify-center overflow-hidden">
                <PlaceholderImage
                  query="error message in code"
                  alt="Error screenshot"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {index === 1 && (
              <div className="w-full h-32 bg-[#2a2a2a] rounded-lg flex items-center justify-center p-4">
                <p className="text-gray-200 italic">"Something broke—please fix the JSX syntax."</p>
              </div>
            )}

            {index === 2 && (
              <div className="w-full h-32 bg-[#2a2a2a] rounded-lg flex items-center justify-center overflow-hidden">
                <PlaceholderImage
                  query="fixed code with successful result"
                  alt="Fixed code screenshot"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {card.success && (
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
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
