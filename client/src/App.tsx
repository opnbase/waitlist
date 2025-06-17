"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { BeamsBackground } from "@/components/beams-background";
import { comingSoonPageContent } from "@/lib/page-content";

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import NewsletterForm from "./components/newsletter-form";
import { Play } from "lucide-react";

export default function HomePage() {
  const [titleNumber, setTitleNumber] = useState(0);

  const animatedWords = useMemo(() => comingSoonPageContent.animatedWords, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber((n) => (n + 1) % animatedWords.length);
    }, 2000);
    return () => clearTimeout(id);
  }, [titleNumber, animatedWords]);

  return (
    <BeamsBackground intensity="medium">
      <div className="flex flex-col min-h-screen text-white">
        <Navbar />

        <main className="flex flex-grow items-start sm:items-center py-12 md:py-16 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 w-full max-w-screen-xl mx-auto">
            <div className="w-full md:w-1/2">
              <p className="text-lg sm:text-xl text-neutral-200 mb-2 sm:mb-4">
                {comingSoonPageContent.preTitle}
              </p>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight flex flex-col sm:flex-row sm:items-center">
                <span className="h-[1.3em]">{comingSoonPageContent.title}</span>
                <span className="hidden sm:inline-block">&nbsp;</span>
                <span className="relative inline-flex h-[1.3em] w-[12ch] overflow-hidden">
                  {animatedWords.map((word, index) => (
                    <motion.span
                      key={index}
                      className="absolute left-0"
                      initial={{ y: "100%", opacity: 0 }}
                      animate={
                        titleNumber === index
                          ? { y: "0%", opacity: 1 }
                          : {
                              y: titleNumber > index ? "-100%" : "100%",
                              opacity: 0,
                            }
                      }
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </h1>
              <NewsletterForm />
            </div>

            {/* right-section */}
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <div
                className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl backdrop-blur-md flex items-center justify-center group cursor-pointer"
                role="button"
                aria-label="Play video (mock)"
                tabIndex={0}
                // onClick={() => console.log("Play video clicked")} // Example action
              >
                <div className="p-4 bg-white/20 rounded-full shadow-lg group-hover:bg-white/30 transition-all duration-300 ease-in-out transform group-hover:scale-110">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              </div>
          </div>
        </main>

        <Footer />
      </div>
    </BeamsBackground>
  );
}
