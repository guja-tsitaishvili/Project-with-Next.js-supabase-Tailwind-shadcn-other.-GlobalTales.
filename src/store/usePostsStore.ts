// stores/usePostsStore.ts

//before MapLeaflet component fetched posts only once, inside its useEffect.
// after i create a new post in CreatePost for example, nothing automatically re-runs that fetch, 
// so new markers dont appear. to fix that we introduce Zustand store, that manages post markers globally. 
// both MapLeaflet and CreatePost can interact through that store
import { create } from "zustand";
import client from "@/api/client";
import { getGeoTaggedPostIdsClient } from "@/components/map/filter";

const POSTS_BUCKET = "posts";

type Point = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string | null;
  imageUrl: string;
};


function parseCoordsFromLocation(s?: string | null): { lat: number; lng: number } | null {
  if (!s) return null;
  const generic = s.match(/(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (!generic) return null;
  const lat = Number(generic[1]);
  const lng = Number(generic[2]);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return null;
}

  async function fetchPoints(): Promise<Point[]> {
  const ids = await getGeoTaggedPostIdsClient(300);
  if (!ids.length) return [];

      const { data: rows, error } = await client
        .from("posts")
        .select("id,image_path,title,description,location")
        .in("id", ids);

      if (error) throw error;

      const paths = rows?.map((r) => r.image_path) ?? [];
      const { data: signed } = await client.storage
        .from(POSTS_BUCKET)
        .createSignedUrls(paths, 3600);

      const signedMap = new Map<string, string>();
      paths.forEach((p, i) => {
        const url = signed?.[i]?.signedUrl;
        if (p && url) signedMap.set(p, url);
      });

      return (
          rows?.map((p) => {
          const coords = parseCoordsFromLocation(p.location);
          if (!coords) return null;
          return {
            id: p.id,
            lat: coords.lat,
            lng: coords.lng,
            title: p.title ?? "Untitled",
            description: p.description,
            imageUrl:
              signedMap.get(p.image_path) || //probably this is null
              client.storage.from(POSTS_BUCKET).getPublicUrl(p.image_path).data.publicUrl ||
              "",
          } as Point;
        })
        .filter(Boolean) as Point[] 
      );
    }


    // ✅ Zustand store
export const usePostsStore = create<{
  points: Point[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
}>((set) => ({
  points: [],
  loading: false,

  fetchPosts: async () => {
    set({ loading: true });
    try {
      const pts = await fetchPoints();
      set({ points: pts, loading: false });
    } catch (e) {
      console.error("fetchPosts error:", e);
      set({ loading: false });
    }
  },
}));
