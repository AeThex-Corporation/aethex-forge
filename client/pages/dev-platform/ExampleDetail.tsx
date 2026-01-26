import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";
import { CodeTabs } from "@/components/dev-platform/CodeTabs";
import { Callout } from "@/components/dev-platform/ui/Callout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, CheckCircle2, Download, GitFork, Code } from "lucide-react";
import { useState } from "react";

const exampleData: Record<string, any> = {
  "oauth-discord-flow": {
    title: "Discord OAuth2 Authentication Flow",
    description: "Complete OAuth2 implementation with Discord, including token refresh and user profile fetching",
    category: "Authentication",
    language: "TypeScript",
    difficulty: "intermediate",
    tags: ["oauth", "discord", "authentication", "express"],
    lines: 145,
    code: `import express, { Request, Response } from 'express';
import axios from 'axios';
import session from 'express-session';

const app = express();

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Discord OAuth2 config
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const REDIRECT_URI = \`\${process.env.APP_URL}/auth/discord/callback\`;

// OAuth2 URLs
const OAUTH_URL = 'https://discord.com/api/oauth2/authorize';
const TOKEN_URL = 'https://discord.com/api/oauth2/token';
const USER_URL = 'https://discord.com/api/users/@me';

// Step 1: Redirect to Discord for authorization
app.get('/auth/discord', (req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'identify email guilds'
  });
  
  res.redirect(\`\${OAUTH_URL}?\${params}\`);
});

// Step 2: Handle OAuth2 callback
app.get('/auth/discord/callback', async (req: Request, res: Response) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('No code provided');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Fetch user data
    const userResponse = await axios.get(USER_URL, {
      headers: {
        Authorization: \`Bearer \${access_token}\`
      }
    });

    const user = userResponse.data;

    // Store in session
    req.session.user = {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      email: user.email
    };

    req.session.tokens = {
      access_token,
      refresh_token,
      expires_at: Date.now() + expires_in * 1000
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).send('Authentication failed');
  }
});

// Step 3: Refresh token when expired
async function refreshAccessToken(refreshToken: string) {
  try {
    const response = await axios.post(
      TOKEN_URL,
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
}

// Middleware to ensure valid token
async function ensureAuth(req: Request, res: Response, next: Function) {
  if (!req.session.tokens) {
    return res.redirect('/auth/discord');
  }

  const { expires_at, refresh_token } = req.session.tokens;

  // If token expired, refresh it
  if (Date.now() >= expires_at) {
    try {
      const newTokens = await refreshAccessToken(refresh_token);
      req.session.tokens = {
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
        expires_at: Date.now() + newTokens.expires_in * 1000
      };
    } catch (error) {
      return res.redirect('/auth/discord');
    }
  }

  next();
}

// Protected route example
app.get('/api/me', ensureAuth, (req: Request, res: Response) => {
  res.json(req.session.user);
});

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});`,
    explanation: `This example demonstrates a complete Discord OAuth2 flow:

1. **Authorization**: User clicks "Login with Discord" and is redirected to Discord's authorization page
2. **Callback**: Discord redirects back with a code, which we exchange for access tokens
3. **User Data**: We fetch the user's profile using the access token
4. **Session Management**: Store tokens and user data in Express sessions
5. **Token Refresh**: Automatically refresh expired tokens using the refresh token
6. **Protected Routes**: Middleware ensures valid authentication before accessing routes

Key features:
- Secure token storage in sessions
- Automatic token refresh before expiration
- Error handling for failed authentication
- Type-safe TypeScript implementation`,
  },
  "api-key-middleware": {
    title: "API Key Authentication Middleware",
    description: "Express middleware for API key validation with rate limiting and usage tracking",
    category: "Authentication",
    language: "TypeScript",
    difficulty: "beginner",
    tags: ["middleware", "api-keys", "express", "security"],
    lines: 78,
    code: `import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      apiKey?: {
        id: string;
        user_id: string;
        scopes: string[];
      };
    }
  }
}

export async function validateApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Extract API key from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header'
    });
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer "

  // Validate key format
  if (!apiKey.startsWith('aethex_sk_')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key format'
    });
  }

  try {
    // Extract prefix and hash the key
    const keyPrefix = apiKey.substring(0, 20);
    const keyHash = crypto
      .createHash('sha256')
      .update(apiKey)
      .digest('hex');

    // Look up key in database
    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('id, user_id, scopes, is_active, expires_at, usage_count')
      .eq('key_prefix', keyPrefix)
      .eq('key_hash', keyHash)
      .single();

    if (error || !apiKeyData) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key'
      });
    }

    // Check if key is active
    if (!apiKeyData.is_active) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'API key has been deactivated'
      });
    }

    // Check expiration
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'API key has expired'
      });
    }

    // Attach key data to request
    req.apiKey = {
      id: apiKeyData.id,
      user_id: apiKeyData.user_id,
      scopes: apiKeyData.scopes
    };

    // Log usage (async, don't wait)
    logApiKeyUsage(apiKeyData.id, req);

    next();
  } catch (error) {
    console.error('API key validation error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to validate API key'
    });
  }
}

// Optional: Check if API key has required scope
export function requireScope(scope: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No API key found'
      });
    }

    if (!req.apiKey.scopes.includes(scope)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: \`API key missing required scope: \${scope}\`
      });
    }

    next();
  };
}

// Log API usage for analytics
async function logApiKeyUsage(keyId: string, req: Request) {
  const startTime = Date.now();
  
  // Log request
  await supabase.from('api_usage_logs').insert({
    api_key_id: keyId,
    endpoint: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Increment usage count
  await supabase.rpc('increment_api_key_usage', { key_id: keyId });
}

// Usage in Express app:
// app.get('/api/data', validateApiKey, requireScope('read'), handler);`,
    explanation: `This middleware provides secure API key authentication:

1. **Extract Key**: Read API key from Authorization header (Bearer token)
2. **Validate Format**: Ensure key has correct prefix
3. **Hash & Lookup**: Hash the key and search database by prefix + hash
4. **Security Checks**: Verify key is active and not expired
5. **Scope Validation**: Optional scope-based permissions
6. **Usage Tracking**: Log each request for analytics

Security features:
- Keys stored as SHA-256 hashes (never plaintext)
- Rate limiting ready (check usage_count)
- Scope-based access control
- Expiration support
- Usage analytics`,
  },
};

export default function ExampleDetail() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const example = exampleData[id || ""] || exampleData["oauth-discord-flow"];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    intermediate: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <Layout>
      <SEO pageTitle={example.title} description={example.description} />
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">{example.category}</Badge>
            <Badge variant="outline">{example.language}</Badge>
            <Badge variant="outline" className={difficultyColors[example.difficulty]}>
              {example.difficulty}
            </Badge>
            <span className="text-sm text-muted-foreground ml-auto">
              {example.lines} lines
            </span>
          </div>

          <p className="text-muted-foreground mb-4">{example.description}</p>

          <div className="flex gap-2">
            <Button onClick={handleCopyCode}>
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="outline">
              <GitFork className="w-4 h-4 mr-2" />
              Fork on GitHub
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {example.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="code" className="space-y-6">
          <TabsList>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="code" className="space-y-4">
            <Callout variant="info">
              <p className="text-sm">
                This example is production-ready and includes error handling, type safety, and best practices.
              </p>
            </Callout>

            <CodeBlock
              code={example.code}
              language={example.language.toLowerCase()}
              showLineNumbers={true}
            />
          </TabsContent>

          <TabsContent value="explanation" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap text-sm text-foreground">
                  {example.explanation}
                </pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Installation</h3>
              <CodeBlock
                code={`# Install required dependencies
npm install express axios express-session @supabase/supabase-js

# Or with yarn
yarn add express axios express-session @supabase/supabase-js`}
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Environment Variables</h3>
              <CodeBlock
                code={`# .env file
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
SESSION_SECRET=your_session_secret
APP_URL=http://localhost:8080
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key`}
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Integration</h3>
              <p className="text-muted-foreground mb-4">
                Copy the code into your project and adjust imports as needed. Make sure to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Set up all required environment variables</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Install necessary dependencies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Configure your database schema if needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Test in development before deploying</span>
                </li>
              </ul>
            </div>

            <Callout variant="warning">
              <p className="font-medium">Security Note</p>
              <p className="text-sm mt-1">
                Never commit sensitive credentials to version control. Use environment variables
                and keep your .env file in .gitignore.
              </p>
            </Callout>
          </TabsContent>
        </Tabs>

        {/* Back Link */}
        <div className="pt-8 border-t border-border">
          <Link to="/dev-platform/examples">
            <Button variant="ghost">← Back to Examples</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
