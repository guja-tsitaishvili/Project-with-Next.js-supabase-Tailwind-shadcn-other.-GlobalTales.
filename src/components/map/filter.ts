// lib/geo-filter.client.ts
"use client";

import client from "@/api/client";

/** Returns only the post IDs whose `location` contains valid lat/lng. */
export async function getGeoTaggedPostIdsClient(limit = 200): Promise<string[]> {
  // Pull the minimum data needed to decide: id + location
  const { data, error } = await client
    .from("posts")
    .select("id, location")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`Failed to load posts: ${error.message}`);
  if (!data) return [];

  const ids: string[] = [];
  for (const row of data) {
    if (hasCoords(row.location)) ids.push(row.id);
  }
  return ids;
}

/* ---------------- helpers ---------------- */

function hasCoords(s: string | null | undefined): boolean {
  const parsed = parseCoordsFromLocation(s);
  return !!parsed;
}

// Accepts formats like:
// "41.7151, 44.8271", "(41.7151,44.8271)", "lat: 41.7 lon: 44.8"
function parseCoordsFromLocation(
  s: string | null | undefined
): { lat: number; lng: number } | null {
  if (!s) return null;

  // labeled "lat ... lon ..."
  const labeled = s.match(
    /lat(?:itude)?\s*[:=]?\s*(-?\d{1,2}(?:\.\d+)?)\D+lon(?:g(?:itude)?)?\s*[:=]?\s*(-?\d{1,3}(?:\.\d+)?)/i
  );
  if (labeled) {
    const lat = Number(labeled[1]);
    const lng = Number(labeled[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  // generic "lat,lng" (allow spaces/parentheses)
  const generic = s.match(/(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)/);
  if (generic) {
    const lat = Number(generic[1]);
    const lng = Number(generic[2]);
    if (isValidLatLng(lat, lng)) return { lat, lng };
  }

  return null;
}

function isValidLatLng(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}
