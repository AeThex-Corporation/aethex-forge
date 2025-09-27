import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

export default function GetStarted() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <h1 className="text-3xl font-bold text-gradient-purple">
            Get Started
          </h1>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
            <li>Create your account or sign in.</li>
            <li>Complete onboarding to tailor your experience.</li>
            <li>Explore your personalized dashboard and projects.</li>
          </ol>
          <div className="flex gap-3 pt-4">
            <Link to="/onboarding" className="text-aethex-400 hover:underline">
              Start Onboarding
            </Link>
            <Link to="/dashboard" className="text-aethex-400 hover:underline">
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
