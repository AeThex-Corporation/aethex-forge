import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface EcosystemLicenseModalProps {
  open: boolean;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export default function EcosystemLicenseModal({
  open,
  onAccept,
  onReject,
  isLoading,
}: EcosystemLicenseModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [confirmOriginal, setConfirmOriginal] = useState(false);

  const handleAccept = () => {
    if (!agreeToTerms || !confirmOriginal) {
      return;
    }
    onAccept();
  };

  const allChecked = hasReadTerms && agreeToTerms && confirmOriginal;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onReject()}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            🎵 Welcome to the Ethos Library
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Before you upload your first track, please review and accept the
            Ecosystem License
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert */}
          <Alert className="bg-blue-500/10 border-blue-500/30">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              This is a one-time agreement. By contributing to the Ethos
              Library, you're helping build a vibrant community of creators.
              We're transparent about how your work will be used.
            </AlertDescription>
          </Alert>

          {/* License Terms Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white">
              KND-008: AeThex Ecosystem License
            </h3>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-white">
                  What is the Ecosystem License?
                </strong>
              </p>
              <p>
                The Ecosystem License allows AeThex development teams
                (specifically our GameForge arm) to use your track for free in
                non-commercial projects. This includes:
              </p>

              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Game prototypes and development</li>
                <li>Internal research and testing</li>
                <li>Community showcases and demos</li>
                <li>Educational materials</li>
              </ul>

              <p>
                <strong className="text-white">What you keep:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>100% ownership of your music</li>
                <li>Full credit and attribution</li>
                <li>
                  Right to license commercially (outside AeThex ecosystem)
                </li>
                <li>Ability to use elsewhere without restriction</li>
              </ul>

              <p>
                <strong className="text-white">Commercial Use:</strong>
              </p>
              <p>
                If you want to license your track for commercial use (outside
                our ecosystem), you can set your own price on the NEXUS
                marketplace or negotiate directly with clients.
              </p>

              <p>
                <strong className="text-white">Getting Help:</strong>
              </p>
              <p>
                Our CORP arm can help negotiate high-value commercial licenses
                and connect you with enterprise clients.
              </p>

              <hr className="border-slate-600 my-4" />

              <p className="text-xs text-slate-400">
                Version 1.0 | Effective Date: {new Date().toLocaleDateString()}{" "}
                | For complete legal terms, see our{" "}
                <a
                  href="/docs/legal/knd-008"
                  className="text-pink-400 hover:text-pink-300"
                >
                  full agreement
                </a>
              </p>
            </div>
          </div>

          {/* Agreement Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition">
              <Checkbox
                checked={hasReadTerms}
                onCheckedChange={(checked) =>
                  setHasReadTerms(checked as boolean)
                }
                className="mt-1 border-slate-600"
              />
              <span className="text-sm text-slate-300">
                I have read and understand the Ecosystem License
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition">
              <Checkbox
                checked={agreeToTerms}
                onCheckedChange={(checked) =>
                  setAgreeToTerms(checked as boolean)
                }
                className="mt-1 border-slate-600"
              />
              <span className="text-sm text-slate-300">
                I agree to the KND-008 Ecosystem License terms and allow AeThex
                to use my music for non-commercial projects
              </span>
            </label>

            <label className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800 transition">
              <Checkbox
                checked={confirmOriginal}
                onCheckedChange={(checked) =>
                  setConfirmOriginal(checked as boolean)
                }
                className="mt-1 border-slate-600"
              />
              <span className="text-sm text-slate-300">
                I confirm that this is my original work and I have the right to
                grant these licenses
              </span>
            </label>
          </div>

          {/* Status Indicator */}
          {allChecked && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-400">
                All terms accepted. Ready to continue.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={onReject}
              disabled={isLoading}
              className="border-slate-700"
            >
              Decline & Exit
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!allChecked || isLoading}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Accepting..." : "Accept & Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
