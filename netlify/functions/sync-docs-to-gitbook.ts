import { Handler } from "@netlify/functions";
import { readFileSync } from "fs";
import { join } from "path";

const GITBOOK_API_TOKEN =
  process.env.GITBOOK_API_TOKEN ||
  "gb_api_jORqpp2qlvg7pwlPiIKHAbgcFIDJBIJ1pz09WpIg";
const GITBOOK_SPACE_ID = process.env.GITBOOK_SPACE_ID || "37ITJTgjD56eN3ZI5qtt";

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
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

const handler: Handler = async (event, context) => {
  // Basic auth check
  const authHeader = event.headers["authorization"];
  const expectedAuth = `Bearer ${process.env.SYNC_TOKEN || "aethex-docs-sync"}`;

  if (authHeader !== expectedAuth) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const page of PAGES) {
      try {
        // Read markdown file from docs-migration directory
        const filePath = join(
          process.cwd(),
          "..",
          "..",
          "docs-migration",
          page.file,
        );
        const content = readFileSync(filePath, "utf-8");

        const body = {
          title: page.title,
          description: `AeThex Documentation - ${page.title}`,
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
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Sync complete",
        successful,
        failed,
        results,
      }),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
