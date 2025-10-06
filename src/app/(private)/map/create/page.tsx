"use client";

import { useSearchParams, useRouter } from "next/navigation";
import client from "@/api/client";
import { useState, useTransition } from "react";

export default function CreatePage() {
  const search = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const lat = search.get("lat");
  const lng = search.get("lng");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const location = lat && lng ? `${lat},${lng}` : null;

    startTransition(async () => {
      const {
        data: { user },
      } = await client.auth.getUser();
      if (!user) {
        alert("Please sign in");
        return;
      }

      const { error } = await client
        .from("posts")
        .insert([{ title: title || null, description: description || null, location }]);

      if (error) {
        console.error(error);
        alert("Failed to create post");
        return;
      }
      alert("Post created");
      router.back(); // go back to where you came from
    });
  };

  return (
    <div className="mx-auto max-w-md p-4 space-y-4">
      <h1 className="text-xl font-semibold">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Coordinates</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={lat && lng ? `${lat}, ${lng}` : ""}
            readOnly
            placeholder="Click on the map first"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="mt-1 w-full rounded border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Great spot!"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="mt-1 w-full rounded border p-2 min-h-[96px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this place interesting?"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded border px-3 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-black text-white px-3 py-2"
          >
            {isPending ? "Saving..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}