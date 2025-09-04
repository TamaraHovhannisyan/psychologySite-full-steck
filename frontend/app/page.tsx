// app/page.tsx
import Articles from "@/components/pages/Articles";
import SelfGrowthPage from "@/components/pages/SelfGrowth";
import PsychologyPage from "@/components/pages/Psychology";
import ContactPage from "@/components/pages/Contact";

export default function Home() {
  return (
    <>
      <section>
        <Articles />
      </section>
      <section>
        <SelfGrowthPage />
      </section>
      <section>
        <PsychologyPage />
      </section>
      <section>
        <ContactPage />
      </section>
    </>
  );
}
