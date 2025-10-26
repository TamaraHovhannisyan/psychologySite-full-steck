"use client";

import Image from "next/image";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import React from "react";

const SelfGrowthPage: React.FC = () => {
  return (
    <section className="w-full min-h-screen flex flex-col bg-white text-[#404040] bg-cover bg-center py-12 sm:py-16 lg:py-20">
      <div className="w-full border-[#017187] border-2 mb-8 sm:mb-12" />

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        Self-Growth
      </h2>

      <div className="flex flex-col-reverse lg:flex-row items-center justify-center gap-10 lg:gap-16 px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h3 className="text-xl sm:text-2xl font-semibold">
            Your Journey to Self-Growth Begins Here
          </h3>
          <p className="text-sm sm:text-base leading-7 text-gray-700">
            Self-growth is not a one-time action — it’s a lifelong journey of
            becoming the best version of yourself. Every day is an opportunity
            to learn something new, to challenge your comfort zone, and to move
            one step closer to who you want to be. Real growth begins when you
            decide to stop living on autopilot and start living with awareness.
            It’s about understanding your emotions instead of avoiding them,
            questioning your thoughts instead of believing every one of them,
            and transforming your weaknesses into lessons that strengthen your
            character. Self-growth requires patience and consistency. It’s not
            about comparing your progress to others but about becoming a little
            wiser, calmer, and stronger than you were yesterday. Sometimes, that
            means slowing down, reflecting, and forgiving yourself. Other times,
            it means pushing forward despite fear or uncertainty. Remember —
            growth isn’t always visible. It happens quietly, through your daily
            choices, your mindset, and the way you respond to challenges. The
            more you learn, reflect, and evolve, the more you align with your
            true potential. So take a deep breath, trust your process, and keep
            walking. Your journey to self-growth begins here — and it’s only
            just the beginning.
          </p>

          <Link
            href="/selfgrowth"
            className="bg-[#017187] flex items-center justify-between w-[200px] text-white px-4 py-2 rounded-lg hover:bg-[#015f6c] transition-colors duration-300 shadow-sm"
          >
            <span>Read More</span>
            <CircleArrowRight />
          </Link>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[560px] xl:max-w-[700px] aspect-square">
            {[
              { src: "/pic1.png", from: "amber-700", to: "amber-600" },
              { src: "/pic2.png", from: "blue-300", to: "blue-400" },
              { src: "/pic3.png", from: "slate-800", to: "slate-700" },
              { src: "/pic4.png", from: "yellow-800", to: "amber-700" },
            ].map((img, index) => (
              <div
                key={index}
                className={`relative rounded-3xl bg-gradient-to-br from-${img.from} to-${img.to} shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden`}
              >
                <Image
                  src={img.src}
                  alt="Self Growth"
                  fill
                  className="object-cover"
                  sizes="(min-width:1280px) 350px, (min-width:1024px) 280px, (min-width:640px) 200px, 160px"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelfGrowthPage;
