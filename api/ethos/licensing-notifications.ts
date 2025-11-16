import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

// Initialize email transporter
function getEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: parseInt(process.env.SMTP_PORT || "465") === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const fromEmail = process.env.SMTP_FROM_EMAIL || "no-reply@aethex.tech";

interface LicensingNotification {
  type:
    | "agreement_created"
    | "agreement_approved"
    | "agreement_pending_approval";
  track_id: string;
  artist_id: string;
  licensee_id: string;
  agreement_id: string;
  license_type: string;
}

export default async function handler(req: any, res: any) {
  const { method, body } = req;

  try {
    if (method === "POST") {
      const { action, agreement_id, license_type } = body;
      const authUser = req.headers["x-user-id"];

      if (!authUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (action === "notify-approval") {
        // Notify artist that their licensing agreement was approved
        const { data: agreement, error: agError } = await supabase
          .from("ethos_licensing_agreements")
          .select(
            `
            id,
            track_id,
            licensee_id,
            license_type,
            ethos_tracks(
              id,
              title,
              user_id,
              user_profiles(full_name, email)
            ),
            user_profiles!licensee_id(full_name, email)
          `,
          )
          .eq("id", agreement_id)
          .single();

        if (agError || !agreement) {
          return res.status(404).json({ error: "Agreement not found" });
        }

        const artist = (agreement as any).ethos_tracks?.user_profiles?.[0];
        const licensee = (agreement as any).user_profiles?.[0];
        const trackTitle = (agreement as any).ethos_tracks?.title;

        if (!artist?.email) {
          return res.status(400).json({ error: "Artist email not found" });
        }

        // Send approval notification to artist
        const transporter = getEmailTransporter();
        await transporter.sendMail({
          from: fromEmail,
          to: artist.email,
          subject: `Licensing Agreement Approved - "${trackTitle}" 🎵`,
          html: `
            <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
              <h2 style="color: #db2777;">Licensing Agreement Approved</h2>
              <p>Great news! Your licensing agreement for <strong>"${trackTitle}"</strong> has been approved.</p>
              
              <div style="margin: 24px 0; padding: 16px; background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 4px;">
                <p style="margin: 0; color: #166534;"><strong>Licensee:</strong> ${licensee?.full_name}</p>
                <p style="margin: 8px 0 0 0; color: #166534;"><strong>License Type:</strong> ${agreement.license_type.replace(/_/g, " ").toUpperCase()}</p>
              </div>

              <p>The licensee has approved the agreement and can now use your track according to the license terms. Ensure you review the agreement details and any associated contracts.</p>

              <p style="margin: 24px 0;">
                <a href="https://aethex.dev/ethos/licensing" style="background: linear-gradient(135deg, #db2777, #9333ea); color: #fff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;">View Agreement</a>
              </p>

              <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                This is an automated notification from the Ethos Guild. For questions, contact <a href="mailto:support@aethex.tech">support@aethex.tech</a>.
              </p>
            </div>
          `,
        });

        return res.status(200).json({
          message: "Artist notified of approval",
        });
      }

      if (action === "notify-license-request") {
        // Notify artist that someone wants to license their track
        const { data: agreement, error: agError } = await supabase
          .from("ethos_licensing_agreements")
          .select(
            `
            id,
            track_id,
            licensee_id,
            license_type,
            ethos_tracks(
              id,
              title,
              user_id,
              user_profiles(full_name, email)
            ),
            user_profiles!licensee_id(full_name, email)
          `,
          )
          .eq("id", agreement_id)
          .single();

        if (agError || !agreement) {
          return res.status(404).json({ error: "Agreement not found" });
        }

        const artist = (agreement as any).ethos_tracks?.user_profiles?.[0];
        const licensee = (agreement as any).user_profiles?.[0];
        const trackTitle = (agreement as any).ethos_tracks?.title;

        if (!artist?.email) {
          return res.status(400).json({ error: "Artist email not found" });
        }

        // Send license request notification to artist
        const transporter = getEmailTransporter();
        await transporter.sendMail({
          from: fromEmail,
          to: artist.email,
          subject: `Licensing Request for "${trackTitle}" 🎵`,
          html: `
            <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
              <h2 style="color: #db2777;">New Licensing Request</h2>
              <p>Someone wants to license your track <strong>"${trackTitle}"</strong>!</p>

              <div style="margin: 24px 0; padding: 16px; background: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <p style="margin: 0; color: #1e40af;"><strong>Requestor:</strong> ${licensee?.full_name}</p>
                <p style="margin: 8px 0 0 0; color: #1e40af;"><strong>License Type:</strong> ${agreement.license_type.replace(/_/g, " ").toUpperCase()}</p>
              </div>

              <p>Review the license request and decide whether to approve or decline. You can set custom terms or accept the default licensing agreement.</p>

              <p style="margin: 24px 0;">
                <a href="https://aethex.dev/ethos/licensing" style="background: linear-gradient(135deg, #db2777, #9333ea); color: #fff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;">Review Request</a>
              </p>

              <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                This is an automated notification from the Ethos Guild. For questions, contact <a href="mailto:support@aethex.tech">support@aethex.tech</a>.
              </p>
            </div>
          `,
        });

        return res.status(200).json({
          message: "Artist notified of license request",
        });
      }

      if (action === "notify-rejection") {
        // Notify licensee that their request was rejected
        const { data: agreement, error: agError } = await supabase
          .from("ethos_licensing_agreements")
          .select(
            `
            id,
            track_id,
            licensee_id,
            license_type,
            ethos_tracks(
              id,
              title,
              user_id,
              user_profiles(full_name, email)
            ),
            user_profiles!licensee_id(full_name, email)
          `,
          )
          .eq("id", agreement_id)
          .single();

        if (agError || !agreement) {
          return res.status(404).json({ error: "Agreement not found" });
        }

        const licensee = agreement.user_profiles?.[0];
        const artist = agreement.ethos_tracks?.user_profiles?.[0];
        const trackTitle = agreement.ethos_tracks?.title;

        if (!licensee?.email) {
          return res.status(400).json({ error: "Licensee email not found" });
        }

        // Send rejection notification to licensee
        const transporter = getEmailTransporter();
        await transporter.sendMail({
          from: fromEmail,
          to: licensee.email,
          subject: `Licensing Request Decision - "${trackTitle}" 🎵`,
          html: `
            <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
              <h2 style="color: #db2777;">Licensing Request Decision</h2>
              <p>We've received a decision on your licensing request for <strong>"${trackTitle}"</strong>.</p>

              <div style="margin: 24px 0; padding: 16px; background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px;">
                <p style="margin: 0; color: #7f1d1d;"><strong>Status:</strong> Request Declined</p>
                <p style="margin: 8px 0 0 0; color: #7f1d1d;"><strong>Artist:</strong> ${artist?.full_name}</p>
              </div>

              <p>Unfortunately, the artist declined your licensing request for this track. You may explore other licensing opportunities or reach out to the artist directly if you'd like to discuss custom arrangements.</p>

              <p style="margin: 24px 0;">
                <a href="https://aethex.dev/ethos/library" style="background: linear-gradient(135deg, #db2777, #9333ea); color: #fff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;">Browse Other Tracks</a>
              </p>

              <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                This is an automated notification from the Ethos Guild. For questions, contact <a href="mailto:support@aethex.tech">support@aethex.tech</a>.
              </p>
            </div>
          `,
        });

        return res.status(200).json({
          message: "Licensee notified of rejection",
        });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Licensing notification error:", error);
    return res.status(500).json({ error: error.message });
  }
}
