"use client";
import React from "react";
import Image from "next/image";
import { CircleArrowRight } from "lucide-react";

type Article = {
  id: string;
  img: string;
  title: string;
  text: string;
};

const baseData: Article[] = [
  {
    id: "a1",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
    title: "Հոդված 1",
    text: "Ինչպես կառավարել սթրեսը հոգեբանորեն։",
  },
  {
    id: "a2",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
    title: "Հոդված 2",
    text: "Ինչ է մտքի հիգիենան և ինչպես պահպանել այն։",
  },
  {
    id: "a3",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
    title: "Հոդված 3",
    text: "Ինքնաճանաչումը որպես երջանկության հիմք։",
  },
  {
    id: "a4",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
    title: "Հոդված 4",
    text: "Սահմաններ դնելը՝ հոգեկան առողջության բանալի։",
  },
];

const Articles: React.FC = () => {
  return (
    <div className="w-full bg-white text-[#404040] bg-cover bg-center py-10">
      <div className="max-w-6xl flex flex-col items-center gap-15 mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Հոդվածներ</h3>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
          {baseData.map((item) => (
            <article
              key={`article-${item.id}`}
              className="bg-[#CCE3E7] w-full max-w-xs rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-full h-48 relative">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover p-5 "
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
                <div>
                  <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#017187]">
                  <CircleArrowRight />
                </div>
              </div>
            </article>
          ))}
        </div>

        <button className="bg-[#017187] justify-between flex w-[200px] text-white px-4 py-2 rounded-lg hover:bg-[#015f6c] transition-colors duration-300 mt-8">
          <p>Ավելին</p>
          <CircleArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Articles;
