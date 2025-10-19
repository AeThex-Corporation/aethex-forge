import Layout from "@/components/Layout";
import WixHero from "@/components/wix/WixHero";
import ServiceCard from "@/components/wix/ServiceCard";
import FAQList from "@/components/wix/FAQ";
import LeadForm from "@/components/wix/LeadForm";
import services from "@/data/wix/services";
import faqs from "@/data/wix/faqs";

export default function Wix() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        <WixHero />

        <section className="container mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">
            What we build
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard
                key={s.id}
                name={s.name}
                summary={s.summary}
                highlights={s.highlights}
              />
            ))}
          </div>
        </section>

        <LeadForm />

        <section className="container mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">FAQ</h2>
          <FAQList items={faqs.slice(0, 4)} />
        </section>
      </div>
    </Layout>
  );
}
