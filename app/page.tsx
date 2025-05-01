"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Slide1 from "@/components/slides/slide-1"
import Slide2 from "@/components/slides/slide-2"
import Slide3 from "@/components/slides/slide-3"
import Slide4 from "@/components/slides/slide-4"
import Slide5 from "@/components/slides/slide-5"
import Slide6 from "@/components/slides/slide-6"
import Slide7 from "@/components/slides/slide-7"
import Slide8 from "@/components/slides/slide-8"
import Slide9 from "@/components/slides/slide-9"
import Slide10 from "@/components/slides/slide-10"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 10

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextSlide()
      } else if (e.key === "ArrowLeft") {
        prevSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentSlide])

  return (
    <main className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center">
      <div className="max-w-[1200px] w-full h-screen p-[5%] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {currentSlide === 0 && <Slide1 />}
            {currentSlide === 1 && <Slide2 />}
            {currentSlide === 2 && <Slide3 />}
            {currentSlide === 3 && <Slide4 />}
            {currentSlide === 4 && <Slide5 />}
            {currentSlide === 5 && <Slide6 />}
            {currentSlide === 6 && <Slide7 />}
            {currentSlide === 7 && <Slide8 />}
            {currentSlide === 8 && <Slide9 />}
            {currentSlide === 9 && <Slide10 />}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-4">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 rounded-full bg-[#00E3E3]/10 text-white disabled:opacity-30"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-sm">
            {currentSlide + 1} / {totalSlides}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="p-2 rounded-full bg-[#00E3E3]/10 text-white disabled:opacity-30"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </main>
  )
}
