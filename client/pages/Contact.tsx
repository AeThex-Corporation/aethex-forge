import Layout from "@/components/Layout";

export default function Contact() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h1 className="text-3xl font-bold text-gradient-purple">
            Contact Us
          </h1>
          <p className="text-muted-foreground">
            Have a project or question? Reach out and we’ll get back within 1–2
            business days.
          </p>
          <div className="grid gap-6">
            <div className="p-6 rounded-xl bg-card/50 border border-border/50">
              <h2 className="font-semibold mb-2">Email</h2>
              <p className="text-sm text-muted-foreground">
                support@aethex.biz
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border/50">
              <h2 className="font-semibold mb-2">Community</h2>
              <p className="text-sm text-muted-foreground">
                Join the community hub to ask questions and collaborate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
