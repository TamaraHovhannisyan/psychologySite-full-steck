import { CircleArrowRight } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Հոգեբանություն | MentalWeb",
  description:
    "Հոգեբանական հոդվածներ՝ օգնելու քեզ հասկանալ ինքդ քեզ, հաղթահարել վախերն ու կայունանալ։",
};

const dummyArticles = [
  {
    id: 1,
    title: "Ինչու մենք կրկնում ենք անցյալը մեր մտքում",
    summary:
      "Հոգեբանության տեսանկյունից՝ սա սովորական երևույթ է։ Գիտենք՝ ինչու է դա տեղի ունենում և ինչպես կարող ենք հաղթահարել։",
  },
  {
    id: 2,
    title: "Անհանգստության կառավարման 5 պարզ մեթոդ",
    summary:
      "Պարզ տեխնիկաներ՝ օգնելու համար քեզ հանգստացնել միտքը և վերականգնել ուշադրությունը։",
  },
  {
    id: 3,
    title: "Ինչպես աշխատում է ենթագիտակցությունը",
    summary:
      "Գիտություն ու հոգեբանություն՝ քո ներքին աշխատանքի մեխանիզմների մասին։",
  },
];

export default function PsychologyPage() {
  return (
    <section className="w-full flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="w-full my-10 border-[#017187] border-2" />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
        Հոգեբանություն
      </h1>

      <p className="text-base sm:text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Բացահայտիր մարդու ներաշխարհը՝ վախեր, ենթագիտակցություն և մտածողություն։
        Գտի՛ր գիտականորեն հիմնավորված հոդվածներ՝ որոնք կօգնեն քեզ հոգեպես
        կայունանալ։
      </p>

      <div className="w-full max-w-7xl grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {dummyArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white border hover:bg-[#CCE3E7] border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col h-full"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-4 flex-1">{article.summary}</p>

            <Link
              href={`/articles/${article.id}`}
              className="text-black hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#017187] rounded"
              aria-label={`Կարդալ ավելին՝ «${article.title}»`}
            >
              Կարդալ ավելին →
            </Link>
          </div>
        ))}

        <div className="flex justify-center sm:col-span-2 lg:col-span-3">
          <button className="bg-[#017187] justify-between flex w-[200px] text-white px-4 py-2 rounded-lg hover:bg-[#015f6c] transition-colors duration-300">
            <p>Ավելին</p>
            <CircleArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
