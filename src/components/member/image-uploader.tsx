"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface ImageUploaderProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

// ─── Cloudinary unsigned upload ───────────────────────────────────────────────

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

async function uploadToCloudinary(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", "ecospark/ideas");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? "Upload failed");
  }

  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ImageUploader({
  value,
  onChange,
  maxImages = 5,
  disabled = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const canUploadMore = value.length < maxImages;

  // ── Handle files ───────────────────────────────────────────────────────────

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remaining = maxImages - value.length;
      const toUpload = Array.from(files).slice(0, remaining);

      if (toUpload.length < files.length) {
        toast.warning(
          `Only ${remaining} more image(s) allowed. Extra files ignored.`,
        );
      }

      // Validate types + size (max 5MB each)
      const valid = toUpload.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`"${file.name}" is not an image.`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds 5MB limit.`);
          return false;
        }
        return true;
      });

      if (valid.length === 0) return;

      setUploading(true);
      const toastId = toast.loading(
        `Uploading ${valid.length} image${valid.length > 1 ? "s" : ""}...`,
      );

      try {
        const results = await Promise.all(valid.map(uploadToCloudinary));
        onChange([...value, ...results]);
        toast.success("Images uploaded!", { id: toastId });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        toast.error(message, { id: toastId });
      } finally {
        setUploading(false);
        // Reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [value, onChange, maxImages],
  );

  // ── Remove image ───────────────────────────────────────────────────────────

  function handleRemove(publicId: string) {
    onChange(value.filter((img) => img.publicId !== publicId));
  }

  // ── Drag and drop ──────────────────────────────────────────────────────────

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (disabled || !canUploadMore) return;
    handleFiles(e.dataTransfer.files);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((img) => (
            <div
              key={img.publicId}
              className="relative group aspect-square rounded-lg overflow-hidden border border-border"
            >
              <Image
                src={img.url}
                alt="Uploaded idea image"
                fill
                className="object-cover"
                sizes="150px"
              />
              {/* Remove overlay */}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(img.publicId)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone — hidden when limit reached */}
      {canUploadMore && !disabled && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 cursor-pointer transition-colors",
            dragOver && "border-primary bg-primary/5",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {/* Upload icon */}
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-sm text-foreground font-medium">
              {uploading ? "Uploading..." : "Click or drag images here"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PNG, JPG, WEBP — max 5MB each &bull; {value.length}/{maxImages}{" "}
              uploaded
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Limit reached message */}
      {!canUploadMore && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxImages} images uploaded.{" "}
          <button
            type="button"
            className="underline hover:text-foreground"
            onClick={() => onChange([])}
          >
            Clear all
          </button>
        </p>
      )}
    </div>
  );
}
