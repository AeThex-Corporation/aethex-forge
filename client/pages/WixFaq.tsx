import Layout from "@/components/Layout";
import FAQList from "@/components/wix/FAQ";
import faqs from "@/data/wix/faqs";

export default function WixFaq() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-10">
        <section className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Wix FAQ</h1>
          <FAQList items={faqs} />
        </section>
      </div>
    </Layout>
  );
}
