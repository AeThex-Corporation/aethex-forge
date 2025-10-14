import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const defaultFromAddress =
  process.env.RESEND_FROM_EMAIL ?? "AeThex OS <no-reply@aethex.dev>";
const verifySupportEmail =
  process.env.VERIFY_SUPPORT_EMAIL ?? "support@aethex.biz";

const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

export const emailService = {
  get isConfigured() {
    return Boolean(resendClient);
  },

  async sendVerificationEmail(params: {
    to: string;
    verificationUrl: string;
    fullName?: string | null;
  }) {
    if (!resendClient) {
      throw new Error("Email service is not configured. Set RESEND_API_KEY.");
    }

    const { to, verificationUrl, fullName } = params;
    const safeName = fullName?.trim() || "there";

    const subject = "Verify your AeThex account";
    const previewText = "Confirm your AeThex account to access the dashboard.";

    const html = `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
        <h2 style="color: #5b21b6;">Welcome to AeThex, ${safeName}!</h2>
        <p>Click the button below to verify your account and unlock your personal dashboard.</p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;">Verify my account</a>
        </p>
        <p>If the button does not work, paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 14px; color: #334155;">${verificationUrl}</p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
        <p style="font-size: 12px; color: #64748b;">
          Didnt create an account? Please ignore this email or contact <a href="mailto:${verifySupportEmail}">${verifySupportEmail}</a>.
        </p>
      </div>
    `;

    const text = [
      `Welcome to AeThex, ${safeName}!`,
      "",
      "Use the link below to verify your account:",
      verificationUrl,
      "",
      `If you didn't request this, contact us at ${verifySupportEmail}.`,
    ].join("\n");

    await resendClient.emails.send({
      from: defaultFromAddress,
      to,
      subject,
      html,
      text,
      headers: {
        "X-AeThex-Email": "verification",
        "X-Entity-Ref-ID": verificationUrl.slice(-24),
      },
      tags: [{ name: "template", value: "auth-verification" }],
      reply_to: verifySupportEmail,
    });
  },
};
