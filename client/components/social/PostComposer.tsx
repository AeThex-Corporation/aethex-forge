import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { communityService } from "@/lib/supabase-service";
import { storage } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function PostComposer({
  onPosted,
  suggestedTags = [],
}: {
  onPosted?: () => void;
  suggestedTags?: string[];
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrlInput, setMediaUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const reset = () => {
    setText("");
    setMediaFile(null);
    setMediaUrlInput("");
    setSelectedTags([]);
  };

  const uploadToStorage = async (file: File): Promise<string | null> => {
    try {
      if (!storage || !("from" in storage)) return null;
      const bucket = storage.from("post_media");
      const ext = file.name.split(".").pop() || "bin";
      const path = `${user?.id || "anon"}/${Date.now()}.${ext}`;
      const { data, error } = await bucket.upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });
      if (error) return null;
      if (!data) return null;
      const { data: publicUrl } = bucket.getPublicUrl(data.path);
      return publicUrl.publicUrl || null;
    } catch {
      return null;
    }
  };

  const handlePost = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to post",
      });
      return;
    }
    if (!text.trim() && !mediaFile && !mediaUrlInput.trim()) {
      toast({ description: "Write something or attach media" });
      return;
    }
    setSubmitting(true);
    try {
      let mediaUrl: string | null = mediaUrlInput.trim() || null;
      let mediaType: "image" | "video" | "none" = "none";

      if (mediaFile) {
        const maybeUrl = await uploadToStorage(mediaFile);
        mediaUrl = maybeUrl;
        if (!mediaUrl) {
          // fallback to base64 data URL
          mediaUrl = await readFileAsDataURL(mediaFile);
        }
      }

      if (mediaUrl) {
        if (
          /\.(mp4|webm|mov)(\?.*)?$/i.test(mediaUrl) ||
          /video\//.test(mediaFile?.type || "")
        ) {
          mediaType = "video";
        } else if (
          /\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(mediaUrl) ||
          /image\//.test(mediaFile?.type || "")
        ) {
          mediaType = "image";
        }
      }

      const content = JSON.stringify({
        text: text.trim(),
        mediaUrl,
        mediaType,
      });
      const title =
        text.trim().slice(0, 80) ||
        (mediaType === "video"
          ? "New video"
          : mediaType === "image"
            ? "New photo"
            : "Update");

      const inlineTags = Array.from(
        (text.match(/#[\p{L}0-9_]+/gu) || []).map((t) =>
          t.replace(/^#/, "").toLowerCase(),
        ),
      );
      const baseTags = mediaType === "none" ? ["update"] : [mediaType, "feed"];
      const combinedTags = Array.from(
        new Set([
          ...baseTags,
          ...selectedTags.map((t) => t.toLowerCase()),
          ...inlineTags,
        ]).values(),
      );

      await communityService.createPost({
        author_id: user.id,
        title,
        content,
        category: mediaType === "none" ? "text" : mediaType,
        tags: combinedTags,
        is_published: true,
      } as any);

      toast({ title: "Posted", description: "Your update is live" });
      reset();
      onPosted?.();
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Could not post",
        description: e?.message || "Try again later",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-background/70 border-border/40">
      <CardContent className="p-4 space-y-3">
        <Textarea
          placeholder="Share an update… Use #hashtags to tag topics"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[80px]"
        />
        {suggestedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <Button
                  key={tag}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  className={active ? "bg-aethex-500/80 text-white" : ""}
                  onClick={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag],
                    )
                  }
                >
                  #{tag}
                </Button>
              );
            })}
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
          />
          <Input
            placeholder="Or paste media URL (image/video)"
            value={mediaUrlInput}
            onChange={(e) => setMediaUrlInput(e.target.value)}
          />
          <div className="ml-auto" />
          <Button onClick={handlePost} disabled={submitting}>
            {submitting ? "Posting…" : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
