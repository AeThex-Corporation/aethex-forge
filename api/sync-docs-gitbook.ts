import { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";

const GITBOOK_API_TOKEN = process.env.GITBOOK_API_TOKEN;
const GITBOOK_SPACE_ID = process.env.GITBOOK_SPACE_ID;

// Validate environment variables
if (!GITBOOK_API_TOKEN || !GITBOOK_SPACE_ID) {
  throw new Error(
    "Missing required environment variables: GITBOOK_API_TOKEN and GITBOOK_SPACE_ID",
  );
}

const PAGES = [
  {
    title: "Welcome to AeThex Documentation",
    slug: "overview",
    file: "01-overview.md",
  },
  {
    title: "Getting Started",
    slug: "getting-started",
    file: "02-getting-started.md",
  },
  { title: "Platform Guide", slug: "platform", file: "03-platform.md" },
  {
    title: "API Reference",
    slug: "api-reference",
    file: "04-api-reference.md",
  },
  { title: "Tutorials", slug: "tutorials", file: "05-tutorials.md" },
  { title: "CLI Tools", slug: "cli", file: "06-cli.md" },
  { title: "Code Examples", slug: "examples", file: "07-examples.md" },
  { title: "Integrations", slug: "integrations", file: "08-integrations.md" },
  { title: "Curriculum", slug: "curriculum", file: "09-curriculum.md" },
];

async function makeRequest(
  method: string,
  path: string,
  body?: any,
): Promise<any> {
  const response = await fetch(`https://api.gitbook.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${GITBOOK_API_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "AeThex-Docs-Sync",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const page of PAGES) {
      try {
        const filePath = join(process.cwd(), "docs-migration", page.file);
        const content = readFileSync(filePath, "utf-8");

        const body = {
          title: page.title,
          description: `AeThex Documentation - ${page.title}`,
          document: {
            markdown: content,
          },
        };

        await makeRequest("POST", `/spaces/${GITBOOK_SPACE_ID}/pages`, body);
        results.push({ page: page.title, status: "success" });
        successful++;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results.push({
          page: page.title,
          status: "failed",
          error: errorMessage,
        });
        failed++;
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return res.status(200).json({
      message: "Sync complete",
      successful,
      failed,
      results,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: errorMessage });
  }
}
