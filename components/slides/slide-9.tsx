"use client"

import { motion } from "framer-motion"

export default function Slide9() {
  const terminalText = `curl glencornell.com | head
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Glen Cornell</title>
  <link rel="stylesheet" href="/styles.css">
</head>`

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-4xl font-bold mb-8">Use the Deployed Site as Context</h2>

      <motion.p
        className="text-xl mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Point new ChatGPT sessions at https://glencornell.com → richer, up-to-date answers.
      </motion.p>

      <motion.div
        className="flex-1 bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <TypewriterTerminal text={terminalText} />
      </motion.div>
    </div>
  )
}

function TypewriterTerminal({ text }: { text: string }) {
  const lines = text.split("\n")

  return (
    <div>
      {lines.map((line, lineIndex) => (
        <motion.div
          key={lineIndex}
          className={`whitespace-pre ${lineIndex > 0 && lineIndex < 4 ? "text-[#00E3E3]" : ""}`}
        >
          {Array.from(line).map((char, charIndex) => (
            <motion.span
              key={`${lineIndex}-${charIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.01,
                delay: (lineIndex * line.length + charIndex) * (2 / text.length),
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
