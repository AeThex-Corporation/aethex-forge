import Layout from "@/components/Layout";

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <h1 className="text-3xl font-bold text-gradient-purple">
            About AeThex
          </h1>
          <p className="text-muted-foreground">
            AeThex crafts digital realities through cutting-edge engineering and
            design. Our team builds products, tools, and experiences that
            empower developers, creators, and organizations.
          </p>
          <section className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card/50 border border-border/50">
              <h2 className="font-semibold mb-2">Mission</h2>
              <p className="text-sm text-muted-foreground">
                Deliver world-class software that turns bold ideas into reality.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border/50">
              <h2 className="font-semibold mb-2">What we do</h2>
              <p className="text-sm text-muted-foreground">
                Apps, platforms, research, and consulting across web, game, and
                AI.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border/50">
              <h2 className="font-semibold mb-2">Values</h2>
              <p className="text-sm text-muted-foreground">
                Quality, transparency, long-term partnerships.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
