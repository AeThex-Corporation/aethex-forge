import { createClient } from "@supabase/supabase-js";
import { emailService } from "../../server/email";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE || "",
);

interface VerificationRequest {
  id: string;
  user_id: string;
  artist_profile_id: string;
  status: "pending" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  submission_notes?: string;
  portfolio_links?: string[];
  user_profiles?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  ethos_artist_profiles?: {
    bio: string;
    skills: string[];
    for_hire: boolean;
    sample_price_track?: number;
  };
}

export default async function handler(req: any, res: any) {
  const { method, query, body } = req;

  try {
    if (method === "GET") {
      // Get verification requests (admin only)
      const { status = "pending", limit = 20, offset = 0 } = query;
      const authUser = req.headers["x-user-id"];

      if (!authUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user is admin
      const { data: adminCheck } = await supabase
        .from("user_profiles")
        .select("is_admin")
        .eq("id", authUser)
        .single();

      if (!adminCheck?.is_admin) {
        return res
          .status(403)
          .json({ error: "Only admins can view verification requests" });
      }

      const query_builder = supabase
        .from("ethos_verification_requests")
        .select(
          `
          id,
          user_id,
          artist_profile_id,
          status,
          submitted_at,
          reviewed_at,
          reviewed_by,
          rejection_reason,
          submission_notes,
          portfolio_links,
          user_profiles:user_id(full_name, email, avatar_url),
          ethos_artist_profiles:artist_profile_id(bio, skills, for_hire, sample_price_track)
        `,
          { count: "exact" },
        )
        .eq("status", status)
        .order("submitted_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, count, error } = await query_builder;

      if (error) throw error;

      return res.status(200).json({ data, total: count });
    }

    if (method === "POST") {
      const {
        action,
        request_id,
        rejection_reason,
        submission_notes,
        portfolio_links,
      } = body;
      const authUser = req.headers["x-user-id"];

      if (!authUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (action === "submit") {
        // Artist submits for verification
        const { data: existingRequest } = await supabase
          .from("ethos_verification_requests")
          .select("id")
          .eq("user_id", authUser)
          .eq("status", "pending")
          .single();

        if (existingRequest) {
          return res
            .status(400)
            .json({ error: "You already have a pending verification request" });
        }

        // Create verification request
        const { data: request, error: requestError } = await supabase
          .from("ethos_verification_requests")
          .insert({
            user_id: authUser,
            artist_profile_id: authUser,
            status: "pending",
            submission_notes,
            portfolio_links,
          })
          .select()
          .single();

        if (requestError) throw requestError;

        // Log the submission
        await supabase.from("ethos_verification_audit_log").insert({
          request_id: request.id,
          action: "submitted",
          actor_id: authUser,
          notes: "Artist submitted verification request",
        });

        return res.status(201).json({ data: request });
      }

      if (action === "approve") {
        // Admin approves artist
        const { data: adminCheck } = await supabase
          .from("user_profiles")
          .select("is_admin")
          .eq("id", authUser)
          .single();

        if (!adminCheck?.is_admin) {
          return res
            .status(403)
            .json({ error: "Only admins can approve verification" });
        }

        const { data: request, error: updateError } = await supabase
          .from("ethos_verification_requests")
          .update({
            status: "approved",
            reviewed_at: new Date().toISOString(),
            reviewed_by: authUser,
          })
          .eq("id", request_id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update artist profile to verified
        await supabase
          .from("ethos_artist_profiles")
          .update({ verified: true })
          .eq("user_id", request.user_id);

        // Log the approval
        await supabase.from("ethos_verification_audit_log").insert({
          request_id,
          action: "approved",
          actor_id: authUser,
          notes: "Artist verified by admin",
        });

        // Send verification email
        const { data: userData } = await supabase
          .from("user_profiles")
          .select("email, full_name")
          .eq("id", request.user_id)
          .single();

        if (userData?.email && emailService.isConfigured) {
          try {
            // Send verification approval email using nodemailer
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT || "465"),
              secure: parseInt(process.env.SMTP_PORT || "465") === 465,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
            });

            await transporter.sendMail({
              from: process.env.SMTP_FROM_EMAIL || "no-reply@aethex.tech",
              to: userData.email,
              subject: "Your Ethos Guild Artist Verification - Approved! 🎵",
              html: `
                <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
                  <h2 style="color: #db2777;">Welcome to the Ethos Guild, ${userData.full_name}!</h2>
                  <p>Congratulations! Your artist verification has been approved.</p>
                  <p>You can now:</p>
                  <ul>
                    <li>Upload and publish tracks with the Ethos license</li>
                    <li>Appear in the verified artists directory</li>
                    <li>Receive commission requests from AeThex teams</li>
                    <li>Access commercial licensing opportunities</li>
                  </ul>
                  <p style="margin: 24px 0;">
                    <a href="https://aethex.dev/ethos/settings" style="background: linear-gradient(135deg, #db2777, #9333ea); color: #fff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;">Go to artist settings</a>
                  </p>
                </div>
              `,
            });
          } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
          }
        }

        return res.status(200).json({ data: request });
      }

      if (action === "reject") {
        // Admin rejects artist
        const { data: adminCheck } = await supabase
          .from("user_profiles")
          .select("is_admin")
          .eq("id", authUser)
          .single();

        if (!adminCheck?.is_admin) {
          return res
            .status(403)
            .json({ error: "Only admins can reject verification" });
        }

        const { data: request, error: updateError } = await supabase
          .from("ethos_verification_requests")
          .update({
            status: "rejected",
            reviewed_at: new Date().toISOString(),
            reviewed_by: authUser,
            rejection_reason,
          })
          .eq("id", request_id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Log the rejection
        await supabase.from("ethos_verification_audit_log").insert({
          request_id,
          action: "rejected",
          actor_id: authUser,
          notes: rejection_reason,
        });

        // Send rejection email
        const { data: userData } = await supabase
          .from("user_profiles")
          .select("email, full_name")
          .eq("id", request.user_id)
          .single();

        if (userData?.email && emailService.isConfigured) {
          try {
            // Send rejection email using nodemailer
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT || "465"),
              secure: parseInt(process.env.SMTP_PORT || "465") === 465,
              auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
              },
            });

            await transporter.sendMail({
              from: process.env.SMTP_FROM_EMAIL || "no-reply@aethex.tech",
              to: userData.email,
              subject: "Ethos Guild Artist Verification - Application Decision",
              html: `
                <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a;">
                  <h2 style="color: #db2777;">Ethos Guild Artist Verification</h2>
                  <p>Thank you for your interest in the Ethos Guild.</p>
                  <p>Unfortunately, your application was not approved at this time.</p>
                  ${rejection_reason ? `<p style="margin: 16px 0; padding: 12px 16px; background: #fee2e2; border-left: 4px solid #ef4444; color: #7f1d1d;"><strong>Feedback:</strong> ${rejection_reason}</p>` : ""}
                  <p>You're welcome to reapply with updates to your portfolio or qualifications.</p>
                  <p style="margin: 24px 0;">
                    <a href="https://aethex.dev/ethos" style="background: linear-gradient(135deg, #db2777, #9333ea); color: #fff; padding: 12px 20px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;">Learn more about Ethos Guild</a>
                  </p>
                </div>
              `,
            });
          } catch (emailError) {
            console.error("Failed to send rejection email:", emailError);
          }
        }

        return res.status(200).json({ data: request });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: error.message });
  }
}
