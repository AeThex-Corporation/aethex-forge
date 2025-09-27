import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold text-gradient-purple">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">By using AeThex services, you agree to the following terms.</p>
          <section className="space-y-3">
            <h2 className="font-semibold">Use of Service</h2>
            <p className="text-sm text-muted-foreground">You agree not to misuse or attempt to disrupt our services.</p>
            <h2 className="font-semibold">Accounts</h2>
            <p className="text-sm text-muted-foreground">Keep your credentials secure. You're responsible for activity under your account.</p>
            <h2 className="font-semibold">Liability</h2>
            <p className="text-sm text-muted-foreground">Services are provided as-is without warranties to the fullest extent permitted by law.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
