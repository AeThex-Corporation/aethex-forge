import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/dev-platform/Breadcrumbs";
import { ThreeColumnLayout } from "@/components/dev-platform/layouts/ThreeColumnLayout";
import { ApiEndpointCard } from "@/components/dev-platform/ui/ApiEndpointCard";
import { CodeTabs } from "@/components/dev-platform/CodeTabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, Activity, User, Shield, Database } from "lucide-react";

const navigationSections = [
  { id: "authentication", title: "Authentication", icon: Key },
  { id: "api-keys", title: "API Keys", icon: Key },
  { id: "users", title: "Users", icon: User },
  { id: "content", title: "Content", icon: Database },
  { id: "rate-limits", title: "Rate Limits", icon: Shield },
];

export default function ApiReference() {
  const sidebarContent = (
    <div className="space-y-1">
      {navigationSections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <section.icon className="w-4 h-4" />
          {section.title}
        </a>
      ))}
    </div>
  );

  const asideContent = (
    <div className="space-y-4">
      <Card className="p-4 border-primary/20 bg-primary/5">
        <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Key className="w-4 h-4" />
          API Authentication
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          All requests require authentication via API key in the Authorization header.
        </p>
        <code className="text-xs block p-2 bg-background rounded border border-border">
          Authorization: Bearer aethex_sk_...
        </code>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-2">Base URL</h3>
        <code className="text-xs block p-2 bg-muted rounded">
          https://aethex.dev/api
        </code>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-2">Rate Limits</h3>
        <ul className="text-xs space-y-2 text-muted-foreground">
          <li>• 60 requests/minute</li>
          <li>• 10,000 requests/day</li>
          <li>• Upgradable with Pro plan</li>
        </ul>
      </Card>
    </div>
  );

  return (
    <Layout>
      <SEO pageTitle="API Reference" description="Complete documentation for the AeThex Developer API" />
      <Breadcrumbs className="mb-6" />
      <ThreeColumnLayout
        sidebar={sidebarContent}
        aside={asideContent}
      >
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              The AeThex API allows you to programmatically interact with the platform.
              Access user data, create content, manage community features, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <Activity className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">RESTful API</h3>
                <p className="text-sm text-muted-foreground">
                  Simple HTTP requests with JSON responses
                </p>
              </Card>
              <Card className="p-4">
                <Shield className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Secure</h3>
                <p className="text-sm text-muted-foreground">
                  API key authentication with rate limiting
                </p>
              </Card>
              <Card className="p-4">
                <Database className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Comprehensive</h3>
                <p className="text-sm text-muted-foreground">
                  Access all platform features programmatically
                </p>
              </Card>
            </div>
          </section>

          {/* Authentication */}
          <section id="authentication">
            <h2 className="text-2xl font-bold mb-4">Authentication</h2>
            <p className="text-muted-foreground mb-6">
              Authenticate your requests using an API key in the Authorization header.
            </p>

            <CodeTabs
              title="Authentication Example"
              examples={[
                {
                  language: "javascript",
                  label: "JavaScript",
                  code: `const response = await fetch('https://aethex.dev/api/user/profile', {
  headers: {
    'Authorization': 'Bearer aethex_sk_your_api_key_here',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`,
                },
                {
                  language: "python",
                  label: "Python",
                  code: `import requests

headers = {
    'Authorization': 'Bearer aethex_sk_your_api_key_here',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://aethex.dev/api/user/profile',
    headers=headers
)

data = response.json()
print(data)`,
                },
                {
                  language: "bash",
                  label: "cURL",
                  code: `curl https://aethex.dev/api/user/profile \\
  -H "Authorization: Bearer aethex_sk_your_api_key_here" \\
  -H "Content-Type: application/json"`,
                },
              ]}
            />
          </section>

          {/* API Keys Endpoints */}
          <section id="api-keys">
            <h2 className="text-2xl font-bold mb-4">API Keys</h2>
            <p className="text-muted-foreground mb-6">
              Manage your API keys programmatically.
            </p>

            <div className="space-y-4">
              <ApiEndpointCard
                method="GET"
                endpoint="/api/developer/keys"
                description="List all API keys for the authenticated user"
                scopes={["read"]}
              />

              <ApiEndpointCard
                method="POST"
                endpoint="/api/developer/keys"
                description="Create a new API key"
                scopes={["write"]}
              />

              <div className="mt-4">
                <CodeTabs
                  title="Create API Key Example"
                  examples={[
                    {
                      language: "javascript",
                      label: "JavaScript",
                      code: `const response = await fetch('https://aethex.dev/api/developer/keys', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer aethex_sk_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Production API Key',
    scopes: ['read', 'write'],
    expiresInDays: 90
  })
});

const { key } = await response.json();
console.log('New key:', key.full_key);
// IMPORTANT: Save this key securely - it won't be shown again!`,
                    },
                    {
                      language: "python",
                      label: "Python",
                      code: `import requests

response = requests.post(
    'https://aethex.dev/api/developer/keys',
    headers={
        'Authorization': 'Bearer aethex_sk_your_api_key_here',
        'Content-Type': 'application/json'
    },
    json={
        'name': 'Production API Key',
        'scopes': ['read', 'write'],
        'expiresInDays': 90
    }
)

key = response.json()['key']
print('New key:', key['full_key'])
# IMPORTANT: Save this key securely - it won't be shown again!`,
                    },
                  ]}
                />
              </div>

              <ApiEndpointCard
                method="DELETE"
                endpoint="/api/developer/keys/:id"
                description="Revoke an API key"
                scopes={["write"]}
              />

              <ApiEndpointCard
                method="GET"
                endpoint="/api/developer/keys/:id/stats"
                description="Get usage statistics for an API key"
                scopes={["read"]}
              />
            </div>
          </section>

          {/* Users Endpoints */}
          <section id="users">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <p className="text-muted-foreground mb-6">
              Access user profiles and data.
            </p>

            <div className="space-y-4">
              <ApiEndpointCard
                method="GET"
                endpoint="/api/user/profile"
                description="Get the authenticated user's profile"
                scopes={["read"]}
              />

              <div className="mt-4">
                <CodeTabs
                  title="Get User Profile Example"
                  examples={[
                    {
                      language: "javascript",
                      label: "JavaScript",
                      code: `const response = await fetch('https://aethex.dev/api/user/profile', {
  headers: {
    'Authorization': 'Bearer aethex_sk_your_api_key_here'
  }
});

const profile = await response.json();
console.log('Username:', profile.username);
console.log('Level:', profile.level);
console.log('XP:', profile.total_xp);`,
                    },
                    {
                      language: "python",
                      label: "Python",
                      code: `import requests

response = requests.get(
    'https://aethex.dev/api/user/profile',
    headers={'Authorization': 'Bearer aethex_sk_your_api_key_here'}
)

profile = response.json()
print(f"Username: {profile['username']}")
print(f"Level: {profile['level']}")
print(f"XP: {profile['total_xp']}")`,
                    },
                  ]}
                />
              </div>

              <ApiEndpointCard
                method="PATCH"
                endpoint="/api/profile/update"
                description="Update user profile"
                scopes={["write"]}
              />
            </div>
          </section>

          {/* Content Endpoints */}
          <section id="content">
            <h2 className="text-2xl font-bold mb-4">Content</h2>
            <p className="text-muted-foreground mb-6">
              Create and manage community posts and content.
            </p>

            <div className="space-y-4">
              <ApiEndpointCard
                method="GET"
                endpoint="/api/posts"
                description="Get community posts with pagination"
                scopes={["read"]}
              />

              <ApiEndpointCard
                method="POST"
                endpoint="/api/posts"
                description="Create a new community post"
                scopes={["write"]}
              />

              <div className="mt-4">
                <CodeTabs
                  title="Create Post Example"
                  examples={[
                    {
                      language: "javascript",
                      label: "JavaScript",
                      code: `const response = await fetch('https://aethex.dev/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer aethex_sk_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    author_id: 'user_uuid_here',
    title: 'My New Post',
    content: 'This is the post content...',
    category: 'general',
    tags: ['tutorial', 'beginners'],
    is_published: true
  })
});

const post = await response.json();
console.log('Post created:', post.id);`,
                    },
                    {
                      language: "python",
                      label: "Python",
                      code: `import requests

response = requests.post(
    'https://aethex.dev/api/posts',
    headers={
        'Authorization': 'Bearer aethex_sk_your_api_key_here',
        'Content-Type': 'application/json'
    },
    json={
        'author_id': 'user_uuid_here',
        'title': 'My New Post',
        'content': 'This is the post content...',
        'category': 'general',
        'tags': ['tutorial', 'beginners'],
        'is_published': True
    }
)

post = response.json()
print('Post created:', post['id'])`,
                    },
                  ]}
                />
              </div>

              <ApiEndpointCard
                method="POST"
                endpoint="/api/community/posts/:id/like"
                description="Like a community post"
                scopes={["write"]}
              />

              <ApiEndpointCard
                method="POST"
                endpoint="/api/community/posts/:id/comments"
                description="Comment on a post"
                scopes={["write"]}
              />
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits">
            <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
            <p className="text-muted-foreground mb-6">
              API requests are rate limited to ensure fair usage and platform stability.
            </p>

            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Free Plan</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Per Minute</Badge>
                      <span>60 requests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Per Day</Badge>
                      <span>10,000 requests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Keys</Badge>
                      <span>3 API keys max</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Pro Plan</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Per Minute</Badge>
                      <span>300 requests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Per Day</Badge>
                      <span>100,000 requests</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Keys</Badge>
                      <span>10 API keys max</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-semibold mb-3 text-sm">Rate Limit Headers</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Every API response includes rate limit information in the headers:
                </p>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <code className="text-primary">X-RateLimit-Limit:</code>
                    <span className="text-muted-foreground">60</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-primary">X-RateLimit-Remaining:</code>
                    <span className="text-muted-foreground">42</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-primary">X-RateLimit-Reset:</code>
                    <span className="text-muted-foreground">1704672000</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-6">
              <CodeTabs
                title="Handle Rate Limits"
                examples={[
                  {
                    language: "javascript",
                    label: "JavaScript",
                    code: `async function makeRequest(url) {
  const response = await fetch(url, {
    headers: {
      'Authorization': 'Bearer aethex_sk_your_api_key_here'
    }
  });

  // Check rate limit headers
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');
  const reset = response.headers.get('X-RateLimit-Reset');

  console.log(\`Rate limit: \${remaining}/\${limit} remaining\`);
  console.log(\`Resets at: \${new Date(reset * 1000).toISOString()}\`);

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    console.log(\`Rate limited. Retry after \${retryAfter}s\`);
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return makeRequest(url);
  }

  return response.json();
}`,
                  },
                  {
                    language: "python",
                    label: "Python",
                    code: `import requests
import time
from datetime import datetime

def make_request(url):
    response = requests.get(
        url,
        headers={'Authorization': 'Bearer aethex_sk_your_api_key_here'}
    )
    
    # Check rate limit headers
    limit = response.headers.get('X-RateLimit-Limit')
    remaining = response.headers.get('X-RateLimit-Remaining')
    reset = response.headers.get('X-RateLimit-Reset')
    
    print(f'Rate limit: {remaining}/{limit} remaining')
    print(f'Resets at: {datetime.fromtimestamp(int(reset))}')
    
    if response.status_code == 429:
        retry_after = int(response.headers.get('Retry-After', 60))
        print(f'Rate limited. Retry after {retry_after}s')
        time.sleep(retry_after)
        return make_request(url)
    
    return response.json()`,
                  },
                ]}
              />
            </div>
          </section>

          {/* Error Responses */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Error Responses</h2>
            <p className="text-muted-foreground mb-6">
              The API uses conventional HTTP response codes and returns JSON error objects.
            </p>

            <div className="space-y-4">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive">400</Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Bad Request</h3>
                    <p className="text-sm text-muted-foreground">
                      The request was invalid or missing required parameters.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive">401</Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Unauthorized</h3>
                    <p className="text-sm text-muted-foreground">
                      Invalid or missing API key.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive">403</Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Forbidden</h3>
                    <p className="text-sm text-muted-foreground">
                      Valid API key but insufficient permissions for this operation.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive">404</Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Not Found</h3>
                    <p className="text-sm text-muted-foreground">
                      The requested resource does not exist.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive">429</Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Too Many Requests</h3>
                    <p className="text-sm text-muted-foreground">
                      Rate limit exceeded. Check Retry-After header.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="destructive">500</Badge>
                  <div>
                    <h3 className="font-semibold mb-1">Internal Server Error</h3>
                    <p className="text-sm text-muted-foreground">
                      Something went wrong on our end. Try again or contact support.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Error Response Format</h3>
              <CodeTabs
                examples={[
                  {
                    language: "json",
                    label: "JSON",
                    code: `{
  "error": "Unauthorized",
  "message": "Invalid API key",
  "status": 401,
  "timestamp": "2026-01-07T12:34:56.789Z"
}`,
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </ThreeColumnLayout>
    </Layout>
  );
}
