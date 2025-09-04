"use client";

import Image from "next/image";
import { CircleArrowRight } from "lucide-react";
import React from "react";

const SelfGrowthPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white text-[#404040] bg-cover bg-center py-10">
      <div className="w-full border-[#017187] border-2" />

      <h3 className="text-2xl sm:text-3xl font-bold my-8 text-center">
        Ինքնազարգացում
      </h3>

      <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 px-4 sm:px-6 lg:px-10">

        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h3 className="text-xl sm:text-2xl">
            Ինքնազարգացման ճանապարհը սկսվում է այստեղ
          </h3>
          <p className="text-sm sm:text-base leading-7">
            Ինքնազարգացումը ոչ թե միանգամյա գործողություն է, այլ անընդհատ
            ընթացող ճանապարհ, որտեղ դու յուրաքանչյուր օր դառնում ես ավելի լավ
            տարբերակ քո սեփական անձից։ Ինքնազարգացումը ոչ թե միանգամյա
            գործողություն է, այլ անընդհատ ընթացող ճանապարհ, որտեղ դու
            յուրաքանչյուր օր դառնում ես ավելի լավ տարբերակ քո սեփական անձից։
            Ինքնազարգացումը ոչ թե միանգամյա գործողություն է, այլ անընդհատ
            ընթացող ճանապարհ, որտեղ դու յուրաքանչյուր օր դառնում ես ավելի լավ
            տարբերակ քո սեփական անձից։
          </p>

          <button className="bg-[#017187] justify-between flex w-[200px] text-white px-4 py-2 rounded-lg hover:bg-[#015f6c] transition-colors duration-300">
            <p>Ավելին</p>
            <CircleArrowRight />
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">

          <div className="grid grid-cols-2 gap-2.5 w-full max-w-[320px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[560px] xl:max-w-[700px] aspect-square">

            <div className="relative rounded-3xl bg-gradient-to-br from-amber-700 to-amber-600 shadow-lg hover:scale-105 transition-transform duration-300 md:rounded-2xl sm:rounded-xl overflow-hidden">
              <Image
                src="/pic1.png"
                alt="Self Growth"
                fill
                className="object-cover"
                sizes="(min-width:1280px) 350px, (min-width:1024px) 280px, (min-width:640px) 200px, 160px"
                priority={false}
              />
            </div>
       
            <div className="relative rounded-3xl bg-gradient-to-br from-blue-300 to-blue-400 shadow-lg hover:scale-105 transition-transform duration-300 md:rounded-2xl sm:rounded-xl overflow-hidden">
              <Image
                src="/pic2.png"
                alt="Self Growth"
                fill
                className="object-cover"
                sizes="(min-width:1280px) 350px, (min-width:1024px) 280px, (min-width:640px) 200px, 160px"
              />
            </div>

            <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-700 shadow-lg hover:scale-105 transition-transform duration-300 md:rounded-2xl sm:rounded-xl overflow-hidden">
              <Image
                src="/pic3.png"
                alt="Self Growth"
                fill
                className="object-cover"
                sizes="(min-width:1280px) 350px, (min-width:1024px) 280px, (min-width:640px) 200px, 160px"
              />
            </div>

            <div className="relative rounded-3xl bg-gradient-to-br from-yellow-800 to-amber-700 shadow-lg hover:scale-105 transition-transform duration-300 md:rounded-2xl sm:rounded-xl overflow-hidden">
              <Image
                src="/pic4.png"
                alt="Self Growth"
                fill
                className="object-cover"
                sizes="(min-width:1280px) 350px, (min-width:1024px) 280px, (min-width:640px) 200px, 160px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfGrowthPage;
