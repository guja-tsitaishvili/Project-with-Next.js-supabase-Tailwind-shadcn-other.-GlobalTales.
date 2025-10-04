"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import {getGeoTaggedPostIdsClient} from "./filter"
import client from "@/api/client";

const POSTS_BUCKET = "posts";

type PostRow = {
  id: string;
  image_path: string;
  title: string | null;
  description: string | null;
  location: string | null;
};

type Point = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string | null;
  imageUrl: string; // signed/public URL ready for <img>
};

function parseCoordsFromLocation(s?: string | null): { lat: number; lng: number } | null {
  if (!s) return null;
  const labeled = s.match(
    /lat(?:itude)?\s*[:=]?\s*(-?\d{1,2}(?:\.\d+)?)\D+lon(?:g(?:itude)?)?\s*[:=]?\s*(-?\d{1,3}(?:\.\d+)?)/i
  );
   if (labeled) {
    const lat = Number(labeled[1]);
    const lng = Number(labeled[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)
      return { lat, lng };
  }
  const generic = s.match(/(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (generic) {
    const lat = Number(generic[1]);
    const lng = Number(generic[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180)
      return { lat, lng };
  }
  return null;
}

async function fetchPointsForIds(ids: string[]): Promise<Point[]> {
  if (ids.length === 0) return [];

  // get minimal columns needed for popups
  const { data: rows, error } = await client
    .from("posts")
    .select("id,image_path,title,description,location")
    .in("id", ids);

  if (error) throw new Error(error.message);

  const posts = (rows ?? []) as PostRow[];

  // sign all image paths (works for public/private buckets)
  const paths = posts.map((p) => p.image_path);
  const { data: signed, error: signErr } = await client.storage
    .from(POSTS_BUCKET)
    .createSignedUrls(paths, 60 * 60); // 1h

  if (signErr) throw new Error(signErr.message);

  const signedMap = new Map<string, string>();
  paths.forEach((p, i) => {
    const url = signed?.[i]?.signedUrl;
    if (p && url) signedMap.set(p, url);
  });

 return posts
    .map((p) => {
      const coords = parseCoordsFromLocation(p.location);
      if (!coords) return null;
      const imageUrl =
        signedMap.get(p.image_path) ||
        client.storage.from(POSTS_BUCKET).getPublicUrl(p.image_path).data.publicUrl ||
        "";
      return {
        id: p.id,
        lat: coords.lat,
        lng: coords.lng,
        title: p.title ?? "Untitled",
        description: p.description,
        imageUrl,
      } as Point;
    })
    .filter(Boolean) as Point[];
}

export default function MapLeaflet() {
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const logoIcon = L.icon({
  iconUrl: "/VisData/camera-logo.png",          // or a Supabase public URL
  iconSize: [45, 45],            // pixel size of the image
  iconAnchor: [10, 10],          // point that’s placed at the lat/lng (center here)
  popupAnchor: [0, -22]       // popup offset relative to the anchor, // styles the <img> itself
});
  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current).setView([41.7151, 44.8271], 12); // Tbilisi
    mapRef.current = map;

    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors & MapTiler',
        maxZoom: 20,
      }
    ).addTo(map);

    const onClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      router.push(`/create?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`);
    };
    map.on("click", onClick);

    let cancelled = false;
const markers: L.Marker[] = [];

(async () => {
      try {
        // 1) get IDs with coord-like `location`
        const ids = await getGeoTaggedPostIdsClient(300);

        // 2) fetch full data + signed URLs + parsed coords
        const points = await fetchPointsForIds(ids);
        if (cancelled) return;

        // 3) render markers
        for (const p of points) {
          const m = L.marker([p.lat, p.lng], { icon: logoIcon }).addTo(map);
          m.bindPopup(`
            <div style="width:240px">
              <div style="font:600 14px/1.2 system-ui;margin-bottom:6px">${p.title}</div>
              ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:auto;border-radius:12px;display:block"/>` : ""}
              ${p.description ? `<p style="margin-top:6px">${p.description}</p>` : ""}
            </div>
          `);
          markers.push(m);
        }
      } catch (err) {
        console.error("Map points load error:", err);
      }
    })();
    return () => {
      cancelled = true;
      map.off("click", onClick);
      markers.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };



  }, [router]);

  return <div ref={mapDivRef} className="absolute inset-0" />;
}
