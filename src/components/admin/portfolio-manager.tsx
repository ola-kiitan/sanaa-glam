"use client";

import { useMemo, useState } from "react";
import type { PortfolioCategory } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PORTFOLIO_CATEGORY_LABELS } from "@/lib/constants";

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

type FormState = {
  title: string;
  alt: string;
  category: PortfolioCategory;
};

type AdminPortfolioItem = {
  id: string;
  title: string;
  alt: string;
  category: PortfolioCategory;
  imageUrl: string;
  publicId: string;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

const INITIAL_FORM: FormState = {
  title: "",
  alt: "",
  category: "BRIDAL",
};

function moveItem<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  const [entry] = copy.splice(from, 1);
  copy.splice(to, 0, entry);
  return copy;
}

export function PortfolioManager({ initialItems }: { initialItems: AdminPortfolioItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)),
    [items]
  );

  async function uploadAndCreate() {
    if (!file) {
      setError("Please choose an image file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const signatureRes = await fetch("/api/admin/portfolio/upload-signature");
      if (!signatureRes.ok) {
        const body = await signatureRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not initialize upload.");
      }

      const signatureData = (await signatureRes.json()) as UploadSignature;

      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("api_key", signatureData.apiKey);
      uploadData.append("timestamp", String(signatureData.timestamp));
      uploadData.append("folder", signatureData.folder);
      uploadData.append("signature", signatureData.signature);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        { method: "POST", body: uploadData }
      );

      if (!cloudinaryRes.ok) {
        throw new Error("Image upload failed. Check Cloudinary credentials.");
      }

      const uploaded = (await cloudinaryRes.json()) as {
        secure_url: string;
        public_id: string;
        width?: number;
        height?: number;
      };

      const createRes = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          alt: form.alt,
          category: form.category,
          imageUrl: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
          isPublished: true,
        }),
      });

      if (!createRes.ok) {
        const body = await createRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save portfolio item.");
      }

      const data = (await createRes.json()) as { item: AdminPortfolioItem };
      setItems((prev) => [...prev, data.item]);
      setForm(INITIAL_FORM);
      setFile(null);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function togglePublished(id: string, isPublished: boolean) {
    const response = await fetch(`/api/admin/portfolio/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished }),
    });
    if (!response.ok) return;

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPublished } : item)));
  }

  async function removeItem(id: string) {
    const response = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    if (!response.ok) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function persistOrder(nextItems: AdminPortfolioItem[]) {
    setIsSavingOrder(true);
    try {
      await fetch("/api/admin/portfolio/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: nextItems.map((item) => item.id) }),
      });
      setItems(nextItems.map((item, index) => ({ ...item, sortOrder: index })));
    } finally {
      setIsSavingOrder(false);
    }
  }

  async function move(id: string, direction: "up" | "down") {
    const index = sortedItems.findIndex((item) => item.id === id);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= sortedItems.length) return;

    const next = moveItem(sortedItems, index, target);
    await persistOrder(next);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-4">
        <h3 className="font-semibold text-plum-dark">Upload New Image</h3>
        <p className="mt-1 text-sm text-muted-foreground">Select an image, add metadata, and publish in one step.</p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <Label htmlFor="portfolio-title">Title</Label>
            <Input
              id="portfolio-title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Soft bridal glow"
            />
          </div>
          <div>
            <Label htmlFor="portfolio-alt">Alt text</Label>
            <Input
              id="portfolio-alt"
              value={form.alt}
              onChange={(event) => setForm((prev) => ({ ...prev, alt: event.target.value }))}
              placeholder="Bride with natural matte makeup look"
            />
          </div>
          <div>
            <Label htmlFor="portfolio-category">Category</Label>
            <select
              id="portfolio-category"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as PortfolioCategory }))}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            >
              {Object.entries(PORTFOLIO_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="portfolio-file">Image file</Label>
            <Input
              id="portfolio-file"
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <Button
          className="mt-4"
          disabled={isUploading || !file || !form.title || !form.alt}
          onClick={() => void uploadAndCreate()}
        >
          {isUploading ? "Uploading..." : "Upload & Publish"}
        </Button>
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="font-semibold text-plum-dark">Portfolio Items</h3>
        <p className="mt-1 text-sm text-muted-foreground">Reorder, unpublish, or remove images.</p>

        <div className="mt-4 space-y-3">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {PORTFOLIO_CATEGORY_LABELS[item.category]} • {item.isPublished ? "Published" : "Hidden"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" disabled={index === 0 || isSavingOrder} onClick={() => void move(item.id, "up")}>
                  Up
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={index === sortedItems.length - 1 || isSavingOrder}
                  onClick={() => void move(item.id, "down")}
                >
                  Down
                </Button>
                <Button variant="outline" size="sm" onClick={() => void togglePublished(item.id, !item.isPublished)}>
                  {item.isPublished ? "Hide" : "Publish"}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => void removeItem(item.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {sortedItems.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">No portfolio images yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
