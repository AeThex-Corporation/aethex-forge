import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold text-gradient-purple">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">We respect your privacy. This page outlines how we collect, use, and protect your data.</p>
          <section className="space-y-3">
            <h2 className="font-semibold">Data We Collect</h2>
            <p className="text-sm text-muted-foreground">Account details, usage analytics, and content you provide.</p>
            <h2 className="font-semibold">How We Use Data</h2>
            <p className="text-sm text-muted-foreground">To provide services, improve features, and ensure security.</p>
            <h2 className="font-semibold">Your Choices</h2>
            <p className="text-sm text-muted-foreground">You can update or delete your profile and opt-out of marketing.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
