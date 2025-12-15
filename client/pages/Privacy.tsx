import Layout from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient-purple">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective date: 2025-01-21
            </p>
            <p className="text-sm text-muted-foreground">
              This Privacy Policy explains how AeThex ("we", "us") collects,
              uses, shares, and protects information when you use our products,
              sites, and services (the "Services").
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-semibold">Information We Collect</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                Account data: name, username, email, profile details, social
                links.
              </li>
              <li>
                Content: posts, comments, projects, teams, endorsements,
                activity metadata.
              </li>
              <li>
                Usage data: device/browser information, pages visited,
                interactions, approximate location.
              </li>
              <li>
                Cookies & similar: session and preference cookies for
                authentication and settings.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">How We Use Information</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                Provide and improve the Services, including social, projects,
                teams, and notifications.
              </li>
              <li>
                Security, abuse prevention, fraud detection, and diagnostics.
              </li>
              <li>
                Personalization (e.g., recommendations, feed ranking) and
                aggregated analytics.
              </li>
              <li>
                Communications: transactional emails (verification, invites,
                alerts) and product updates.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Discord Integration</h2>
            <p className="text-sm text-muted-foreground">
              When you link your Discord account, we collect and store your
              Discord user ID, username, profile picture, and email. We use this
              data to enable account linking, execute Discord bot commands
              (/verify, /set-realm, /profile, /unlink), assign Discord roles
              based on your AeThex realm, and display your profile in Discord
              Activities. Discord-related data is processed under Discord's
              Privacy Policy. You can unlink your Discord account at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              Web3 & Ethereum Wallet Integration
            </h2>
            <p className="text-sm text-muted-foreground">
              When you connect an Ethereum wallet (via MetaMask or similar), we
              collect and store your wallet address. We use this data for Web3
              authentication and identity verification. We never store private
              keys, seed phrases, or transaction history. Signature verification
              is performed locally on your device. Your wallet address is public
              blockchain data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Roblox Integration</h2>
            <p className="text-sm text-muted-foreground">
              When you link your Roblox account via OAuth, we collect your
              Roblox user ID, username, profile details, and game session data.
              We use this data to enable account linking, track game development
              activities, and display your Roblox portfolio. Roblox data is
              processed under Roblox's Terms of Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              Game Authentication & Server Integration
            </h2>
            <p className="text-sm text-muted-foreground">
              For game developers using AeThex authentication (Unity, Unreal,
              Godot, etc.), we collect game session tokens, player IDs, and
              game-specific authentication data. This data is used to verify
              player identity, manage game sessions, and provide analytics. Game
              developers can request deletion of their game data in accordance
              with data retention policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              AeThex Sentinel & Warden (Browser Extension)
            </h2>
            <p className="text-sm text-muted-foreground">
              Our browser extension provides real-time Data Loss Prevention (DLP)
              security scanning. To provide this protection, the extension processes:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                <strong>User Input & Website Content:</strong> We scan text entered
                into input fields (forms, chat boxes) to detect sensitive information
                (passwords, API keys, PII patterns).
              </li>
              <li>
                <strong>Financial & Personal Information:</strong> We temporarily
                process patterns resembling credit card numbers, social security
                numbers, and other PII solely to redact or block them before
                transmission.
              </li>
              <li>
                <strong>Browser Events:</strong> We monitor specific events (paste,
                form submit) to prevent accidental data leakage.
              </li>
              <li>
                <strong>Device Data:</strong> IP address for location-based security
                policies (geofencing).
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3">
              <strong>Important:</strong> Scanned text is processed locally in your
              browser's memory and is NOT transmitted to our servers unless a
              security policy violation is triggered. If a violation occurs, we
              store only a redacted audit log (User ID, timestamp, rule broken) -
              never the sensitive data itself.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Chrome Web Store Limited Use Disclosure</h2>
            <p className="text-sm text-muted-foreground">
              The AeThex Warden extension's use of information received from Google
              APIs adheres to the{" "}
              <a
                href="https://developer.chrome.com/docs/webstore/program-policies/limited-use/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-aethex-400 hover:underline"
              >
                Chrome Web Store User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                <strong>Minimal Permissions:</strong> We only request browser permissions
                strictly necessary for DLP security scanning functionality. We do not
                request access to browsing history, bookmarks, or other unrelated data.
              </li>
              <li>
                <strong>No Human Review of Personal Data:</strong> User data processed
                by the extension is NOT subject to human review except in cases of:
                (a) explicit user consent, (b) security investigations for abuse/fraud
                prevention, or (c) legal compliance requirements.
              </li>
              <li>
                <strong>No Advertising or Profiling:</strong> We do not use extension
                data for advertising, user profiling, creditworthiness assessment,
                or sale to third parties.
              </li>
              <li>
                <strong>Automated Processing Only:</strong> DLP pattern matching is
                performed by automated systems. Human operators only access aggregated,
                anonymized audit logs for security purposes.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">OAuth Providers</h2>
            <p className="text-sm text-muted-foreground">
              We support multiple OAuth providers including GitHub, Google,
              Discord, Roblox, and Web3 authentication methods. When you
              authorize through any provider, we receive and store the data they
              share (typically ID, email, profile info). You can manage linked
              accounts in your profile settings and unlink them at any time.
              Each provider has its own privacy policy governing how they handle
              your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Data Controller & Data Protection Officer</h2>
            <p className="text-sm text-muted-foreground">
              <strong>Data Controller:</strong> AeThex Inc., 123 Innovation Drive,
              Phoenix, AZ 85001, United States. We are responsible for deciding how
              we collect, hold, and use your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Data Protection Officer (DPO):</strong> For questions about
              data protection or to exercise your rights, contact our DPO at{" "}
              <a href="mailto:dpo@aethex.dev" className="text-aethex-400 hover:underline">
                dpo@aethex.dev
              </a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Legal Bases (EEA/UK)</h2>
            <p className="text-sm text-muted-foreground">
              We process data under: (i) Performance of a contract (providing
              core features), (ii) Legitimate interests (security, analytics,
              product improvement), (iii) Consent (where required), and (iv)
              Compliance with legal obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Sharing & Service Providers</h2>
            <p className="text-sm text-muted-foreground">
              We do not sell your personal information. We use trusted
              sub-processors to operate the platform: Supabase (auth, database,
              storage), Vercel/Netlify (hosting/CDN), and Resend (email). These
              providers process data on our behalf under appropriate agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">International Transfers</h2>
            <p className="text-sm text-muted-foreground">
              Data may be processed in the United States and other countries.
              Where applicable, we rely on appropriate safeguards (e.g., SCCs)
              for cross-border transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Data Retention Schedule</h2>
            <p className="text-sm text-muted-foreground">
              We retain data for as long as needed to provide Services, comply
              with law, resolve disputes, and enforce agreements. Specific retention
              periods include:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                <strong>Account Data:</strong> Retained while your account is active
                and for 30 days after deletion request to allow recovery.
              </li>
              <li>
                <strong>Server Logs & Analytics:</strong> Retained for 90 days, then
                aggregated or deleted.
              </li>
              <li>
                <strong>Security Violation Records:</strong> Retained for 2 years for
                abuse prevention and legal compliance.
              </li>
              <li>
                <strong>Backups:</strong> Retained for 30 days in encrypted form,
                then permanently deleted.
              </li>
              <li>
                <strong>Financial/Transaction Records:</strong> Retained for 7 years
                as required by tax and accounting regulations.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              You may request deletion of your account data, subject to legal holds
              and regulatory requirements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Your Rights</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>
                Access, correction, deletion, and portability of your data.
              </li>
              <li>
                Object to or restrict certain processing; withdraw consent where
                applicable.
              </li>
              <li>Manage notifications and email preferences in-app.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">California Privacy Rights (CCPA/CPRA)</h2>
            <p className="text-sm text-muted-foreground">
              If you are a California resident, you have additional rights under
              the California Consumer Privacy Act (CCPA) and California Privacy
              Rights Act (CPRA):
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                <strong>Right to Know:</strong> Request disclosure of personal
                information we collect, use, disclose, and sell.
              </li>
              <li>
                <strong>Right to Delete:</strong> Request deletion of your personal
                information, subject to certain exceptions.
              </li>
              <li>
                <strong>Right to Correct:</strong> Request correction of inaccurate
                personal information.
              </li>
              <li>
                <strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell
                or share your personal information for cross-context behavioral
                advertising. If this changes, you will have the right to opt out.
              </li>
              <li>
                <strong>Right to Limit Use of Sensitive Data:</strong> Request
                limitations on processing of sensitive personal information.
              </li>
              <li>
                <strong>Right to Non-Discrimination:</strong> You will not receive
                discriminatory treatment for exercising your rights.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Do Not Sell or Share My Personal Information:</strong> AeThex
              does not sell personal information and does not share personal information
              for cross-context behavioral advertising purposes.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@aethex.dev" className="text-aethex-400 hover:underline">
                privacy@aethex.dev
              </a>{" "}
              or submit a request through your account settings. We will verify your
              identity before processing your request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Right to Appeal</h2>
            <p className="text-sm text-muted-foreground">
              If we deny your data rights request (such as access, deletion, or
              correction), you have the right to appeal our decision. To appeal:
            </p>
            <ol className="list-decimal pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                Email{" "}
                <a href="mailto:dpo@aethex.dev" className="text-aethex-400 hover:underline">
                  dpo@aethex.dev
                </a>{" "}
                with the subject line "Privacy Appeal".
              </li>
              <li>
                Include your original request reference number and explain why you
                believe our decision was incorrect.
              </li>
              <li>
                We will review your appeal within 45 days and provide a written
                response explaining our final decision.
              </li>
              <li>
                If you are unsatisfied with our appeal decision, you may file a
                complaint with your local data protection authority (for EEA/UK
                residents) or the California Attorney General (for California residents).
              </li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Security</h2>
            <p className="text-sm text-muted-foreground">
              We use industry-standard measures to protect data in transit and
              at rest. No method of transmission or storage is 100% secure; you
              are responsible for safeguarding credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Children</h2>
            <p className="text-sm text-muted-foreground">
              Our Services are not directed to children under 13 (or as defined
              by local law). We do not knowingly collect data from children. If
              you believe a child has provided data, contact us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Changes</h2>
            <p className="text-sm text-muted-foreground">
              We may update this Policy. Material changes will be announced via
              the app or email. Your continued use after changes constitutes
              acceptance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Contact</h2>
            <p className="text-sm text-muted-foreground">
              For privacy inquiries: privacy@aethex.dev. For support:
              support@aethex.dev. For security issues: security@aethex.dev.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
