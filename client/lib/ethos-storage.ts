import { supabase } from "./supabase";

const BUCKET_NAME = "ethos-tracks";

export interface UploadProgress {
  bytesUploaded: number;
  bytesTotal: number;
  percentComplete: number;
}

export const ethosStorage = {
  /**
   * Upload a track file to Supabase Storage
   * @param file The audio file to upload
   * @param userId The ID of the user uploading the track
   * @param onProgress Callback for upload progress
   * @returns The path to the uploaded file in storage
   */
  async uploadTrackFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<string> {
    try {
      // Ensure bucket exists and is accessible
      const bucketList = await supabase.storage.listBuckets();
      const bucketExists = bucketList.data?.some((b) => b.name === BUCKET_NAME);

      if (!bucketExists) {
        // Bucket doesn't exist, we'll let the upload fail with a helpful error
        throw new Error(
          `Storage bucket "${BUCKET_NAME}" does not exist. Please contact support.`,
        );
      }

      // Create a unique file path
      const timestamp = Date.now();
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${userId}/${timestamp}-${sanitizedFileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Failed to upload file: ${error.message}`);
      }

      if (!data) {
        throw new Error("Upload succeeded but no file path returned");
      }

      return data.path;
    } catch (error) {
      console.error("Track upload error:", error);
      throw error;
    }
  },

  /**
   * Get a public URL for a track file
   * @param filePath The path to the file in storage
   * @returns The public URL for the file
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Download a track file
   * @param filePath The path to the file in storage
   * @returns The file data
   */
  async downloadTrackFile(filePath: string): Promise<Blob> {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);

    if (error) {
      throw new Error(`Failed to download file: ${error.message}`);
    }

    if (!data) {
      throw new Error("Download succeeded but no data returned");
    }

    return data;
  },

  /**
   * Delete a track file
   * @param filePath The path to the file in storage
   */
  async deleteTrackFile(filePath: string): Promise<void> {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  },

  /**
   * Get file metadata (size, created_at, etc.)
   * @param filePath The path to the file in storage
   */
  async getFileMetadata(filePath: string) {
    try {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).info();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Failed to get file metadata:", error);
      throw error;
    }
  },
};

/**
 * Get audio file duration in seconds
 * @param file The audio file
 * @returns Duration in seconds
 */
export async function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        resolve(audioBuffer.duration);
      } catch (error) {
        reject(new Error("Failed to decode audio file"));
      }
    };

    fileReader.onerror = () => {
      reject(new Error("Failed to read audio file"));
    };

    fileReader.readAsArrayBuffer(file);
  });
}
