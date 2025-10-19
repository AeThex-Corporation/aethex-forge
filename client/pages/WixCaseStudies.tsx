import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import studies from "@/data/wix/caseStudies";

export default function WixCaseStudies() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-10">
        <section className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Wix Case Studies
          </h1>
          <div className="grid gap-6 md:grid-cols-2">
            {studies.map((c) => (
              <Card
                key={c.id}
                className="border-border/40 bg-card/60 backdrop-blur"
              >
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                  <CardDescription>{c.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {c.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="rounded border border-border/40 p-3"
                      >
                        <div className="text-muted-foreground">{m.label}</div>
                        <div className="font-semibold">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
