
import { Metadata } from "next";
import { FaEnvelope, FaPhone, FaFacebook } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Կապ | MentalWeb",
  description: "Կապվիր մեզ հետ՝ email-ով, հեռախոսով կամ Facebook էջով։",
};

export default function ContactPage() {
  return (
    <section className="bg-[#F7F8F9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Կապ մեզ հետ
        </h1>

        <div className="space-y-6 text-lg text-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <FaEnvelope className="text-blue-600 text-xl" />
            <a href="mailto:example@mail.com" className="hover:underline">
              example@mail.com
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <FaPhone className="text-green-600 text-xl" />
            <a href="tel:+37499123456" className="hover:underline">
              +374 99 123456
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <FaFacebook className="text-blue-700 text-xl" />
            <a
              href="https://www.facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Մեր Facebook էջը
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
