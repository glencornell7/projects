"use client"

import { motion } from "framer-motion"

export default function Slide4() {
  const bullets = ["Purpose", "Core interactions", "Look & feel cues"]

  const codeContent = `I need a prototype that…
– Shows timeline of user events
– Has dark theme, minimalist
– Uses cards -> modal drill-downs`

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-12">Step 2 — Issue a Build Brief</h2>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        <div className="flex-1">
          <ul className="space-y-4">
            {bullets.map((bullet, index) => (
              <motion.li
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
              >
                <div className="w-6 h-6 rounded-full border-2 border-[#00E3E3] flex items-center justify-center text-sm">
                  ✓
                </div>
                <span className="text-lg">{bullet}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <motion.div
            className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TypewriterText text={codeContent} />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-8 bg-[#00E3E3]/10 p-3 rounded-lg text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <span className="text-[#00E3E3]">Tip:</span> Be explicit but short—V0 works best with 3–5 specs.
      </motion.div>
    </div>
  )
}

function TypewriterText({ text }: { text: string }) {
  const lines = text.split("\n")

  return (
    <div>
      {lines.map((line, lineIndex) => (
        <motion.div key={lineIndex} className="whitespace-pre-wrap">
          {Array.from(line).map((char, charIndex) => (
            <motion.span
              key={`${lineIndex}-${charIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.01,
                delay: (lineIndex * line.length + charIndex) * (3 / text.length),
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
