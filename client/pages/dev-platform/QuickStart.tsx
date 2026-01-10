import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { ThreeColumnLayout } from "@/components/dev-platform/layouts/ThreeColumnLayout";
import { CodeTabs } from "@/components/dev-platform/CodeTabs";
import { Callout } from "@/components/dev-platform/ui/Callout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Key, 
  Code, 
  Rocket, 
  CheckCircle2,
  ExternalLink 
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  { id: "signup", title: "Create Account", icon: CheckCircle2 },
  { id: "api-key", title: "Get API Key", icon: Key },
  { id: "first-request", title: "First Request", icon: Code },
  { id: "explore", title: "Explore API", icon: Rocket },
];

export default function QuickStart() {
  const sidebarContent = (
    <div className="space-y-1">
      {steps.map((step) => (
        <a
          key={step.id}
          href={`#${step.id}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <step.icon className="w-4 h-4" />
          {step.title}
        </a>
      ))}
    </div>
  );

  const asideContent = (
    <div className="space-y-4">
      <Card className="p-4 border-primary/20 bg-primary/5">
        <Zap className="w-8 h-8 text-primary mb-2" />
        <h3 className="font-semibold text-sm mb-2">
          Get Started in 5 Minutes
        </h3>
        <p className="text-xs text-muted-foreground">
          Follow this guide to make your first API request and start building with AeThex.
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">Quick Links</h3>
        <div className="space-y-2">
          <Link to="/dev-platform/dashboard">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Key className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link to="/dev-platform/api-reference">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Code className="w-4 h-4 mr-2" />
              API Reference
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-2">Need Help?</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Join our Discord community for support and examples.
        </p>
        <Button variant="outline" size="sm" className="w-full">
          <ExternalLink className="w-4 h-4 mr-2" />
          Join Discord
        </Button>
      </Card>
    </div>
  );

  return (
    <Layout>
      <SEO pageTitle="Quick Start Guide" description="Get up and running with the AeThex API in minutes" />
      <ThreeColumnLayout sidebar={sidebarContent} aside={asideContent}>
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">Build Something Amazing</h2>
            </div>
            <p className="text-muted-foreground text-lg mb-6">
              This guide will help you make your first API request in under 5 minutes.
              You'll learn how to authenticate, fetch data, and start building.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <Card key={step.id} className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <step.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                </Card>
              ))}
            </div>
          </section>

          {/* Step 1: Create Account */}
          <section id="signup">
            <h2 className="text-2xl font-bold mb-4">Step 1: Create Your Account</h2>
            <p className="text-muted-foreground mb-6">
              First, you'll need an AeThex account to access the developer dashboard.
            </p>

            <Card className="p-6">
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <Badge className="shrink-0">1</Badge>
                  <div>
                    <p className="font-medium mb-1">Sign up for free</p>
                    <p className="text-sm text-muted-foreground">
                      Visit <Link to="/login" className="text-primary hover:underline">aethex.dev/login</Link> and create your account
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="shrink-0">2</Badge>
                  <div>
                    <p className="font-medium mb-1">Verify your email</p>
                    <p className="text-sm text-muted-foreground">
                      Check your inbox and click the verification link
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="shrink-0">3</Badge>
                  <div>
                    <p className="font-medium mb-1">Complete onboarding</p>
                    <p className="text-sm text-muted-foreground">
                      Set up your profile and choose your primary realm
                    </p>
                  </div>
                </li>
              </ol>
            </Card>

            <Callout variant="info" className="mt-4">
              <p className="font-medium">Free for developers</p>
              <p className="text-sm mt-1">
                All AeThex accounts include free API access with generous rate limits.
                No credit card required.
              </p>
            </Callout>
          </section>

          {/* Step 2: Get API Key */}
          <section id="api-key">
            <h2 className="text-2xl font-bold mb-4">Step 2: Generate Your API Key</h2>
            <p className="text-muted-foreground mb-6">
              Navigate to the developer dashboard to create your first API key.
            </p>

            <Card className="p-6 mb-6">
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <Badge className="shrink-0">1</Badge>
                  <div>
                    <p className="font-medium mb-1">Go to Developer Dashboard</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Visit <Link to="/dev-platform/dashboard" className="text-primary hover:underline">Dashboard</Link> → API Keys
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="shrink-0">2</Badge>
                  <div>
                    <p className="font-medium mb-1">Create new key</p>
                    <p className="text-sm text-muted-foreground">
                      Click "Create Key" and give it a name (e.g., "Development Key")
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="shrink-0">3</Badge>
                  <div>
                    <p className="font-medium mb-1">Choose permissions</p>
                    <p className="text-sm text-muted-foreground">
                      Select scopes: <code className="text-xs bg-muted px-1 py-0.5 rounded">read</code> for getting started
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Badge className="shrink-0">4</Badge>
                  <div>
                    <p className="font-medium mb-1">Save your key</p>
                    <p className="text-sm text-muted-foreground">
                      Copy the key immediately - it won't be shown again!
                    </p>
                  </div>
                </li>
              </ol>
            </Card>

            <Callout variant="warning">
              <p className="font-medium">⚠️ Keep your API key secret</p>
              <p className="text-sm mt-1">
                Never commit API keys to git or share them publicly. Store them in environment 
                variables or a secure secrets manager.
              </p>
            </Callout>
          </section>

          {/* Step 3: First Request */}
          <section id="first-request">
            <h2 className="text-2xl font-bold mb-4">Step 3: Make Your First Request</h2>
            <p className="text-muted-foreground mb-6">
              Let's fetch your user profile to verify everything works.
            </p>

            <CodeTabs
              title="Fetch Your Profile"
              examples={[
                {
                  language: "javascript",
                  label: "JavaScript",
                  code: `// Replace with your actual API key
const API_KEY = 'aethex_sk_your_key_here';

async function getMyProfile() {
  const response = await fetch('https://aethex.dev/api/user/profile', {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
  }

  const profile = await response.json();
  
  console.log('Username:', profile.username);
  console.log('Level:', profile.level);
  console.log('Total XP:', profile.total_xp);
  
  return profile;
}

// Run it
getMyProfile()
  .then(profile => console.log('Success!', profile))
  .catch(error => console.error('Error:', error));`,
                },
                {
                  language: "python",
                  label: "Python",
                  code: `import requests
import json

# Replace with your actual API key
API_KEY = 'aethex_sk_your_key_here'

def get_my_profile():
    response = requests.get(
        'https://aethex.dev/api/user/profile',
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    
    if not response.ok:
        raise Exception(f'HTTP {response.status_code}: {response.text}')
    
    profile = response.json()
    
    print(f"Username: {profile['username']}")
    print(f"Level: {profile['level']}")
    print(f"Total XP: {profile['total_xp']}")
    
    return profile

# Run it
try:
    profile = get_my_profile()
    print('Success!', json.dumps(profile, indent=2))
except Exception as e:
    print('Error:', e)`,
                },
                {
                  language: "bash",
                  label: "cURL",
                  code: `# Replace with your actual API key
export API_KEY="aethex_sk_your_key_here"

curl https://aethex.dev/api/user/profile \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json"

# Expected response:
# {
#   "id": "uuid",
#   "username": "yourusername",
#   "level": 5,
#   "total_xp": 4250,
#   "bio": "...",
#   ...
# }`,
                },
              ]}
            />

            <Callout variant="success" className="mt-6">
              <p className="font-medium">🎉 Success!</p>
              <p className="text-sm mt-1">
                If you see your profile data, you're all set! Your API key is working correctly.
              </p>
            </Callout>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Common Issues</h3>
              <div className="space-y-3">
                <Card className="p-4">
                  <code className="text-xs text-destructive">401 Unauthorized</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    Check that your API key is correct and includes the <code className="text-xs">Bearer</code> prefix
                  </p>
                </Card>
                <Card className="p-4">
                  <code className="text-xs text-destructive">429 Too Many Requests</code>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've hit the rate limit. Wait a minute and try again.
                  </p>
                </Card>
              </div>
            </div>
          </section>

          {/* Step 4: Explore */}
          <section id="explore">
            <h2 className="text-2xl font-bold mb-4">Step 4: Explore the API</h2>
            <p className="text-muted-foreground mb-6">
              Now that you're authenticated, try out these common operations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-2">Get Community Posts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Fetch the latest posts from the community feed
                </p>
                <CodeTabs
                  examples={[
                    {
                      language: "javascript",
                      label: "JS",
                      code: `const posts = await fetch(
  'https://aethex.dev/api/posts?limit=10',
  {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`
    }
  }
).then(r => r.json());

console.log(\`Found \${posts.length} posts\`);`,
                    },
                  ]}
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Create a Post</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share content with the community
                </p>
                <CodeTabs
                  examples={[
                    {
                      language: "javascript",
                      label: "JS",
                      code: `const post = await fetch(
  'https://aethex.dev/api/posts',
  {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      author_id: 'your_user_id',
      title: 'Hello World',
      content: 'My first post via API!',
      is_published: true
    })
  }
).then(r => r.json());`,
                    },
                  ]}
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Search Creators</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find creators by arm or skill
                </p>
                <CodeTabs
                  examples={[
                    {
                      language: "javascript",
                      label: "JS",
                      code: `const creators = await fetch(
  'https://aethex.dev/api/creators?arm=labs',
  {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`
    }
  }
).then(r => r.json());

creators.data.forEach(c => {
  console.log(c.username, c.primary_arm);
});`,
                    },
                  ]}
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-2">Browse Opportunities</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover job opportunities on the platform
                </p>
                <CodeTabs
                  examples={[
                    {
                      language: "javascript",
                      label: "JS",
                      code: `const jobs = await fetch(
  'https://aethex.dev/api/opportunities?limit=5',
  {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`
    }
  }
).then(r => r.json());

jobs.data.forEach(job => {
  console.log(job.title, job.job_type);
});`,
                    },
                  ]}
                />
              </Card>
            </div>
          </section>

          {/* Next Steps */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <p className="text-muted-foreground mb-6">
              You're ready to build! Here are some resources to help you continue:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/dev-platform/api-reference">
                <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <Code className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Full API Reference</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete documentation of all endpoints, parameters, and responses
                  </p>
                </Card>
              </Link>

              <Link to="/dev-platform/dashboard">
                <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <Key className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-2">Developer Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your API keys, monitor usage, and track analytics
                  </p>
                </Card>
              </Link>

              <Card className="p-6 h-full">
                <ExternalLink className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Join Community</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get help, share projects, and connect with other developers
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Discord Community
                </Button>
              </Card>
            </div>
          </section>
        </div>
      </ThreeColumnLayout>
    </Layout>
  );
}
