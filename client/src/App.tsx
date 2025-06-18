"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { BeamsBackground } from "@/components/beams-background";
import { comingSoonPageContent } from "@/lib/page-content";

import Footer from "./components/footer";
import Navbar from "./components/navbar";
import NewsletterForm from "./components/newsletter-form";
import { assets } from "./assets";
import { ComingSoonSuspense } from "./components/coming-soon-suspense";

interface IFingerPrint {
  user_agent: string;
  screen: string;
  timezone: string;
  language: string;
  platform: string;
  ip_address?: string;
  fingerprint_hash?: string;
}

export default function HomePage() {
  const [titleNumber, setTitleNumber] = useState(0);

  const animatedWords = useMemo(() => comingSoonPageContent.animatedWords, []);

  async function sendFingerprint() {
    const fingerprint: IFingerPrint = {
      user_agent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform:
        (navigator as any).userAgentData?.platform ||
        navigator.platform ||
        "unknown",
    };

    // Get IP using a simple public API (optional)
    const ipRes = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipRes.json();
    fingerprint.ip_address = ipData.ip;

    // Create hash (mimic server hash logic)
    const raw = Object.values(fingerprint).join("|");
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    fingerprint.fingerprint_hash = hashHex;

    console.log(fingerprint);
  }

  useEffect(() => {
    sendFingerprint();
  }, []);

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
              <ComingSoonSuspense
                imageUrl={assets.thumbnail}
                altText="Video thumbnail"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </BeamsBackground>
  );
}
