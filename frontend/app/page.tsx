
import Articles from "@/components/pages/Articles";
import SelfGrowthPage from "@/components/pages/SelfGrowth";
import PsychologyPage from "@/components/pages/Psychology";
import Contact from "@/components/pages/Contact";

export default function Home() {
  return (
    <main>
      <section id="articles">
        <Articles />
      </section>

      <section id="self-growth">
        <SelfGrowthPage />
      </section>

      <section id="psychology">
        <PsychologyPage />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </main>
  );
}
