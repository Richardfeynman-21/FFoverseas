'use client';

import { motion } from "motion/react";
import { Plane } from "lucide-react";
import { universities } from "../../data/universities";

type University = {
  name: string;
  country: string;
  logo: string;
};

function UniversityCard({ uni }: { uni: University }) {
  return (
    <div
      className="
      group
      flex
      items-center
      gap-4 sm:gap-5
      bg-white/90
      backdrop-blur-md
      border
      border-slate-200
      rounded-2xl
      px-4 py-3.5 sm:px-6 sm:py-5
      w-[280px] sm:w-[340px]
      shrink-0
      transition-all
      duration-500
      hover:-translate-y-2
      hover:border-[#FF0000]/30
      hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
      "
    >
      <div
        className="
        w-12 h-12 sm:w-16 sm:h-16
        rounded-xl
        bg-slate-50
        border
        border-slate-100
        flex
        items-center
        justify-center
        transition-all
        duration-500
        group-hover:scale-110
        "
      >
        <img
          src={uni.logo}
          alt={uni.name}
          className="
          w-8 h-8 sm:w-11 sm:h-11
          object-contain
          grayscale
          opacity-80
          transition-all
          duration-500
          group-hover:grayscale-0
          group-hover:opacity-100
          "
        />
      </div>

      <div className="flex-1">
        <h3
          className="
          font-bold
          text-[#001F3F]
          leading-snug
          text-sm sm:text-base
          "
        >
          {uni.name}
        </h3>

        <p
          className="
          text-xs sm:text-sm
          text-gray-500
          mt-1
          "
        >
          {uni.country}
        </p>
      </div>
    </div>
  );
}

export default function UniversityPartners() {
  return (
    <section
      className="
      relative
      overflow-hidden
      py-20 sm:py-28
      bg-[#FCFCFD]
      "
    >
      {/* Background */}

      <div className="absolute left-[-120px] top-0 w-[450px] h-[450px] rounded-full bg-[#001F3F]/5 blur-[140px]" />

      <div className="absolute right-[-120px] bottom-0 w-[450px] h-[450px] rounded-full bg-[#FF0000]/5 blur-[140px]" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle,#001F3F 1px,transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-[1700px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span
            className="
            uppercase
            tracking-[0.35em]
            text-[#FF0000]
            text-xs
            font-bold
            "
          >
            GLOBAL UNIVERSITY NETWORK
          </span>

          <h2
            className="
            mt-6
            text-fluid-5xl
            font-black
            tracking-tight
            text-[#001F3F]
            "
          >
            Our Global{" "}
            <span className="text-[#FF0000]">
              University Network
            </span>
          </h2>

          <p
            className="
            mt-6
            max-w-3xl
            mx-auto
            text-gray-500
            text-fluid-base
            leading-relaxed
            "
          >
            We proudly collaborate with leading universities
            around the world, helping students access
            internationally recognized education opportunities.
          </p>

          <div className="flex justify-center mt-10">

            <Plane
              className="text-[#FF0000] w-6 h-6 -rotate-45"
            />

          </div>
        </motion.div>

        {/* ===== FIRST ROW ===== */}

        <div className="relative mt-20 overflow-hidden">

          <div className="fade-left" />
          <div className="fade-right" />

          <div className="marquee">

            {[...universities, ...universities].map((uni, i) => (

              <UniversityCard
                key={i}
                uni={uni}
              />

            ))}

          </div>

        </div>
                {/* ===== SECOND ROW ===== */}

        <div className="relative mt-10 overflow-hidden">

          <div className="fade-left" />
          <div className="fade-right" />

          <div className="marquee marquee-reverse">

            {[...universities].reverse()
              .concat([...universities].reverse())
              .map((uni, i) => (

              <UniversityCard
                key={`reverse-${i}`}
                uni={uni}
              />

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}