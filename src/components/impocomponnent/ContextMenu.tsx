// PostOptionsButton.tsx
"use client";

import { useState } from "react";
import supabase from "@/api/client"; // your client-side supabase

interface PostOptionsButtonProps {
  postId: string;
  onDeleteSuccess?: () => void; 
}

export default function PostOptionsButton({ postId, onDeleteSuccess }: PostOptionsButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!postId) return;

    setDeleting(true);

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Failed to delete post:", error.message);
      alert("Failed to delete post");
    } else {
      console.log("Post deleted successfully!");
      alert("Post deleted!");
      // Optionally, you could trigger a parent callback to remove it from UI
    }

    setMenuOpen(false);
    setDeleting(false);
  };

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        &#x22EE; {/* vertical ellipsis */}
      </button>

      {/* Context menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {deleting ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}
    </div>
  );
}
