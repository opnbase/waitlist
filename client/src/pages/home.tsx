import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { comingSoonPageContent } from "@/lib/page-content";
import ComingSoonSuspense from "@/components/coming-soon-animation/coming-soon-suspense";
import { assets } from "@/assets";
import { api } from "@/lib/api-client";
import NewsletterForm from "@/components/newsletter-form";
import { getFingerPrint } from "@/lib/device-fingerprint";

export default function HomePage() {
  const [titleNumber, setTitleNumber] = useState(0);
  const animatedWords = useMemo(() => comingSoonPageContent.animatedWords, []);

  useEffect(() => {
    (async () => {
      try {
        const fp = await getFingerPrint();
        await api.trackUser(fp);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber((n) => (n + 1) % animatedWords.length);
    }, 2000);
    return () => clearTimeout(id);
  }, [titleNumber, animatedWords]);

  return (
    <div className="flex flex-col text-white">
      <main className="flex flex-grow items-start md:items-center py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 w-full max-w-screen-xl mx-auto">
          <div
            id="main-content"
            className="
              w-full
              md:w-3/4 md:mx-auto
              lg:w-1/2 lg:mx-0
              flex flex-col justify-center
            "
          >
            <p className="text-lg sm:text-xl text-neutral-200 mb-2 sm:mb-4">
              {comingSoonPageContent.preTitle}
            </p>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight flex flex-col sm:flex-row sm:items-center">
              <span className="h-[1.3em]">{comingSoonPageContent.title}</span>
              <span className="hidden sm:inline-block">&nbsp;</span>
              <span className="relative inline-flex h-[1.3em] w-[8ch] sm:w-[10ch] md:w-[12ch] overflow-hidden">
                {animatedWords.map((word, idx) => (
                  <motion.span
                    key={idx}
                    className="absolute left-0"
                    initial={{ y: "100%", opacity: 0 }}
                    animate={
                      titleNumber === idx
                        ? { y: "0%", opacity: 1 }
                        : { y: titleNumber > idx ? "-100%" : "100%", opacity: 0 }
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

          <div
            className="
              w-full
              md:w-3/4 md:mx-auto
              lg:w-1/2 lg:mx-0
              flex justify-center items-center
            "
          >
            <ComingSoonSuspense imageUrl={assets.thumbnail} altText="Video thumbnail" />
          </div>
        </div>
      </main>
    </div>
  );
}
