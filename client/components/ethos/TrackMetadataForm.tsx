import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface TrackMetadata {
  title: string;
  description?: string;
  genre: string[];
  bpm?: number;
  license_type: "ecosystem" | "commercial_sample";
  is_published: boolean;
}

interface TrackMetadataFormProps {
  onSubmit: (metadata: TrackMetadata) => void;
  initialData?: Partial<TrackMetadata>;
  isLoading?: boolean;
}

const GENRES = [
  "Synthwave",
  "Orchestral",
  "SFX",
  "Ambient",
  "Electronic",
  "Cinematic",
  "Jazz",
  "Hip-Hop",
  "Folk",
];

export default function TrackMetadataForm({
  onSubmit,
  initialData,
  isLoading,
}: TrackMetadataFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialData?.genre || [],
  );
  const [bpm, setBpm] = useState(initialData?.bpm || "");
  const [licenseType, setLicenseType] = useState<"ecosystem" | "commercial_sample">(
    initialData?.license_type || "ecosystem",
  );
  const [isPublished, setIsPublished] = useState(
    initialData?.is_published !== false,
  );

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || selectedGenres.length === 0) {
      alert("Title and at least one genre are required");
      return;
    }

    onSubmit({
      title,
      description: description || undefined,
      genre: selectedGenres,
      bpm: bpm ? Number(bpm) : undefined,
      license_type: licenseType,
      is_published: isPublished,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">
          Track Title *
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Synthwave Dream"
          className="bg-slate-800 border-slate-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell artists and composers about your track..."
          className="bg-slate-800 border-slate-700 h-24"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-white">Genres * (select at least one)</Label>
        <div className="grid grid-cols-2 gap-3">
          {GENRES.map((genre) => (
            <label key={genre} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
                className="border-slate-600"
              />
              <span className="text-sm text-slate-300">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bpm" className="text-white">
            BPM (optional)
          </Label>
          <Input
            id="bpm"
            type="number"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
            placeholder="120"
            className="bg-slate-800 border-slate-700"
            min="30"
            max="300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="license" className="text-white">
            License Type *
          </Label>
          <Select value={licenseType} onValueChange={(val: any) => setLicenseType(val)}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="ecosystem">
                Ecosystem (Non-commercial)
              </SelectItem>
              <SelectItem value="commercial_sample">
                Commercial Demo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-slate-800/50 border border-slate-700">
        <Checkbox
          checked={isPublished}
          onCheckedChange={(checked) => setIsPublished(checked as boolean)}
          className="border-slate-600"
        />
        <span className="text-sm text-slate-300">
          Publish immediately (visible in track library)
        </span>
      </label>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
      >
        {isLoading ? "Saving..." : "Save Track Metadata"}
      </Button>
    </form>
  );
}
