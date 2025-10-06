"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreatePost from "@/app/(private)/profile/CreatePost"; // <- your component

export default function CreateInterceptedAsModal() {
  const router = useRouter();
  const search = useSearchParams();
  const [open, setOpen] = useState(true);

  const lat = Number(search.get("lat"));
  const lng = Number(search.get("lng"));
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const initialLocation = hasCoords ? `${lat.toFixed(6)}, ${lng.toFixed(6)}` : "";

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && router.back();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => router.back()} />
      <div className="relative z-10 w-[92vw] max-w-md rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Create Post</h2>
          <button onClick={() => router.back()} aria-label="Close">✕</button>
        </div>

        {/* Pass the coords down */}
        <CreatePost
          initialLocation={initialLocation}
          onCreated={() => router.back()}
        />
      </div>
    </div>
  );
}