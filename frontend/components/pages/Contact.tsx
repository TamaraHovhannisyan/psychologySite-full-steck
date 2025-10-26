import { Metadata } from "next";
import { FaEnvelope, FaPhone, FaFacebook } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact | MentalWeb",
  description: "Get in touch with us via email, phone, or Facebook.",
};

export default function ContactPage() {
  return (
    <section className="bg-[#F7F8F9] py-16 px-6 md:px-10 lg:px-16 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
          Contact Us
        </h1>

        <div className="space-y-8 text-lg text-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 bg-white rounded-2xl shadow-sm py-4 px-6 hover:shadow-md transition">
            <FaEnvelope className="text-blue-600 text-2xl" />
            <a
              href="mailto:example@mail.com"
              className="hover:underline break-words"
            >
              example@mail.com
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 bg-white rounded-2xl shadow-sm py-4 px-6 hover:shadow-md transition">
            <FaPhone className="text-green-600 text-2xl" />
            <a href="tel:+37499123456" className="hover:underline">
              +374 99 123456
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 bg-white rounded-2xl shadow-sm py-4 px-6 hover:shadow-md transition">
            <FaFacebook className="text-blue-700 text-2xl" />
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Visit our Facebook page
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-16 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} MentalWeb.
      </footer>
    </section>
  );
}
