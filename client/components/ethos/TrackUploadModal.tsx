import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Upload, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TrackUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ["audio/mpeg", "audio/wav", "audio/mp3"];

export default function TrackUploadModal({
  open,
  onOpenChange,
  onFileSelected,
  isLoading,
}: TrackUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setFile(null);

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Please upload an MP3 or WAV file");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 50MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;
    onFileSelected(file);
  };

  const handleReset = () => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      handleReset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Upload Audio Track</DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload your music or sound effects (MP3 or WAV, up to 50MB)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div
              className="relative border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/mpeg,audio/wav,audio/mp3"
                onChange={handleFileChange}
                className="hidden"
              />

              <Upload className="h-8 w-8 mx-auto mb-2 text-slate-500" />
              <p className="text-sm font-medium text-white mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500">MP3 or WAV • Up to 50MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-slate-400 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-slate-700"
            >
              Cancel
            </Button>

            {file && !isLoading && (
              <>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 border-slate-700"
                >
                  Choose Different
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
                >
                  Proceed to Details
                </Button>
              </>
            )}

            {!file && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              >
                Browse Files
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
