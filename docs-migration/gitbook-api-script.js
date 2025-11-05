/**
 * Gitbook API Script
 *
 * Use this script to push documentation content to your Gitbook workspace
 * via the Gitbook API.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_TOKEN = process.env.GITBOOK_API_TOKEN;
const SPACE_ID = process.env.GITBOOK_SPACE_ID;

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

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.gitbook.com",
      port: 443,
      path: `/v1${path}`,
      method,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "AeThex-Docs-Migration",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve({
            status: res.statusCode,
            data: data ? JSON.parse(data) : null,
            headers: res.headers,
          });
        } catch (error) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function syncDocs() {
  console.log("🚀 Starting documentation sync to Gitbook...\n");

  if (!API_TOKEN || !SPACE_ID) {
    console.error(
      "❌ Missing environment variables: GITBOOK_API_TOKEN or GITBOOK_SPACE_ID",
    );
    process.exit(1);
  }

  let successful = 0;
  let failed = 0;

  for (const page of PAGES) {
    try {
      const filePath = path.join(__dirname, page.file);
      if (!fs.existsSync(filePath)) {
        console.error(`  ✗ File not found: ${page.file}`);
        failed++;
        continue;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      console.log(`  Updating page: ${page.title}...`);

      const body = {
        title: page.title,
        description: `AeThex Documentation - ${page.title}`,
      };

      const response = await makeRequest(
        "POST",
        `/spaces/${SPACE_ID}/pages`,
        body,
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(`  ✓ ${page.title} updated successfully`);
        successful++;
      } else {
        console.error(`  ✗ Failed: ${response.status}`);
        failed++;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
      failed++;
    }
  }

  console.log(
    `\n✅ Sync complete: ${successful} successful, ${failed} failed\n`,
  );
  process.exit(failed > 0 ? 1 : 0);
}

const action = process.argv[2] || "sync";
if (action === "sync") syncDocs();
