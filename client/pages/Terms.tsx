import Layout from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gradient-purple">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Effective date: 2025-01-21
            </p>
            <p className="text-sm text-muted-foreground">
              These Terms govern your access to and use of the AeThex Services.
              By using the Services, you agree to these Terms.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="font-semibold">Accounts & Eligibility</h2>
            <p className="text-sm text-muted-foreground">
              You must be at least 13 years old (or the age required by your
              jurisdiction). You are responsible for maintaining the
              confidentiality of your credentials and for all activity under
              your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">User Content & License</h2>
            <p className="text-sm text-muted-foreground">
              You retain ownership of content you submit. You grant AeThex a
              worldwide, non-exclusive, royalty-free license to host, store,
              reproduce, and display your content solely to operate and improve
              the Services. You represent you have the rights to submit such
              content.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Acceptable Use</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>No unlawful, infringing, or deceptive activity.</li>
              <li>No harassment, hate, or exploitation.</li>
              <li>No malware, spam, scraping, or abuse of API limits.</li>
              <li>
                No attempts to access others’ accounts or data without
                permission.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Projects, Teams, and Matching</h2>
            <p className="text-sm text-muted-foreground">
              Collaboration features (projects, teams, tasks, endorsements) are
              provided as-is. Team owners and project owners are responsible for
              membership, roles, and shared materials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Third-Party Services</h2>
            <p className="text-sm text-muted-foreground">
              We may integrate third-party services (e.g., Supabase, Resend,
              hosting/CDN). Your use of those services is subject to their terms
              and policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              Discord Integration & Bot Services
            </h2>
            <p className="text-sm text-muted-foreground">
              When you authorize Discord account linking, you grant AeThex
              permission to: access your Discord profile information, manage
              verification codes, and assign Discord roles based on your AeThex
              realm. Discord bot commands (/verify, /set-realm, /profile,
              /unlink) are provided as part of our Services. You remain
              responsible for any actions taken on your Discord account through
              our bot. Discord services are governed by Discord's Terms of
              Service in addition to these Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Web3 & Wallet Authentication</h2>
            <p className="text-sm text-muted-foreground">
              When you connect a Web3 wallet (Ethereum, MetaMask, etc.), you
              authorize AeThex to verify your wallet ownership through message
              signing. You acknowledge that: message signing is read-only and
              does not authorize any fund transfers, wallet address is public
              blockchain data, and you remain fully responsible for wallet
              security and management. AeThex does not store or handle wallet
              private keys or funds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Roblox Account Linking</h2>
            <p className="text-sm text-muted-foreground">
              When you link your Roblox account via OAuth, you grant AeThex
              permission to access your Roblox profile information and game
              development data. Your use of Roblox services through AeThex is
              subject to Roblox's Terms of Service. You are responsible for
              maintaining the confidentiality of your Roblox account credentials
              and can unlink your Roblox account at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              Game Authentication & Developer Services
            </h2>
            <p className="text-sm text-muted-foreground">
              Game developers using AeThex authentication services (Unity,
              Unreal, Godot, etc.) agree that: authentication tokens must be
              kept confidential, tokens are for authorized use only and must not
              be shared or sold, game servers are responsible for validating
              tokens before granting access, and AeThex is not liable for
              unauthorized access if tokens are compromised. Game session data
              may be retained for analytics and debugging purposes in accordance
              with our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">OAuth & Third-Party Authorization</h2>
            <p className="text-sm text-muted-foreground">
              We support OAuth integration with GitHub, Google, Discord, Roblox,
              and Web3 providers. When you authorize through any provider, you
              are granting AeThex permission to receive and use the data they
              share. You can review, modify, and revoke these permissions at any
              time through your account settings or the third-party service's
              authorization page. Revoking access may limit certain AeThex
              features that depend on that integration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Intellectual Property</h2>
            <p className="text-sm text-muted-foreground">
              AeThex and its licensors retain all rights to the platform,
              branding, and software. You may not copy, modify, or distribute
              platform code or assets except as permitted by law or written
              authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Termination</h2>
            <p className="text-sm text-muted-foreground">
              We may suspend or terminate your access for violations or risk to
              the platform. You may discontinue use at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              Disclaimers & Limitation of Liability
            </h2>
            <p className="text-sm text-muted-foreground">
              The Services are provided “as-is” without warranties. To the
              maximum extent permitted by law, AeThex will not be liable for
              indirect, incidental, or consequential damages arising from or
              related to your use of the Services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">
              Browser Extension Disclaimer (Sentinel & Warden)
            </h2>
            <p className="text-sm text-muted-foreground">
              The AeThex Sentinel extension and Warden bot are provided for data loss
              prevention purposes. You acknowledge that:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li>
                The extension may interfere with website functionality on certain sites.
                AeThex is not responsible for any website breakage or data loss resulting
                from extension use.
              </li>
              <li>
                No security tool is 100% effective. AeThex does not guarantee prevention
                of all data leaks or security incidents.
              </li>
              <li>
                You are solely responsible for configuring security policies appropriate
                for your organization's needs.
              </li>
              <li>
                The extension requires certain browser permissions to function. You consent
                to granting these permissions when you install the extension.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Indemnification</h2>
            <p className="text-sm text-muted-foreground">
              You agree to indemnify, defend, and hold harmless AeThex Inc., its
              officers, directors, employees, agents, and affiliates from and against
              any claims, liabilities, damages, losses, and expenses (including
              reasonable attorneys' fees) arising out of or related to: (a) your use
              or misuse of the Services, (b) your violation of these Terms, (c) your
              content or data, or (d) your violation of any rights of another party.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Dispute Resolution & Arbitration</h2>
            <p className="text-sm text-muted-foreground">
              Any dispute arising from these Terms or the Services shall be resolved
              through binding arbitration in accordance with the rules of the American
              Arbitration Association. The arbitration shall take place in Arizona, USA.
              You agree to waive any right to participate in a class action lawsuit or
              class-wide arbitration against AeThex Inc. This arbitration agreement does
              not preclude you from bringing issues to the attention of federal, state,
              or local agencies who may seek relief on your behalf.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Changes to Terms</h2>
            <p className="text-sm text-muted-foreground">
              We may update these Terms. Material changes will be announced via
              the app or email. Your continued use constitutes acceptance of
              updated Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-semibold">Governing Law & Contact</h2>
            <p className="text-sm text-muted-foreground">
              These Terms are governed by the laws of the State of Arizona, United States,
              without regard to conflict of law principles. For legal inquiries, contact
              legal@aethex.dev. For general support, contact support@aethex.dev.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
