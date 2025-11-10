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
            <h2 className="font-semibold">Data Retention</h2>
            <p className="text-sm text-muted-foreground">
              We retain data for as long as needed to provide Services, comply
              with law, resolve disputes, and enforce agreements. You may
              request deletion of your account data, subject to legal holds.
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
              For privacy inquiries: privacy@aethex.biz. For support:
              support@aethex.biz.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
