"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

import client from "@/api/client"; // your supabase browser client
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type LatLng = { lat: number; lng: number };

export default function LeafletCreatePost() {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  // Keep a local layer for optimistic markers
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return;

    const map = L.map(mapDivRef.current).setView([41.7151, 44.8271], 12); // Tbilisi
    mapRef.current = map;

    // Tile layer (MapTiler example; replace {key})
    L.tileLayer(
      `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OSM</a> contributors & MapTiler',
        maxZoom: 20,
      }
    ).addTo(map);

    // Markers layer
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Click to open modal
    const onClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      setOpen(true);
    };
    map.on("click", onClick);

    return () => {
      map.off("click", onClick);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleSubmit = async () => {
    if (!coords) return;

    const location = `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;

    startTransition(async () => {
      try {
        // optional: ensure user is logged in (RLS usually uses auth.uid())
        const {
          data: { user },
          error: authErr,
        } = await client.auth.getUser();
        if (authErr || !user) {
          toast.error("You must be logged in to create a post.");
          return;
        }

        const { error: insertErr } = await client
          .from("posts")
          .insert([{ title: title || null, description: description || null, location }]);

        if (insertErr) {
          console.error(insertErr);
          toast.error("Could not create post.");
          return;
        }

        // Optimistic marker
        if (markersLayerRef.current) {
          L.marker([coords.lat, coords.lng]).addTo(markersLayerRef.current);
        }

        // Reset form + close
        setTitle("");
        setDescription("");
        setOpen(false);
        toast.success("Post created!");
      } catch (e) {
        console.error(e);
        toast.error("Unexpected error.");
      }
    });
  };

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
      {/* Map container */}
      <div ref={mapDivRef} id="map" className="absolute inset-0" />

      {/* Optional manual trigger (useful for testing) */}
      <div className="absolute z-[400] right-4 top-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Create post</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
              <DialogDescription>
                Fill in details. Coordinates are auto-filled from your last map click.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Coordinates</label>
                <Input
                  readOnly
                  value={
                    coords ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` : "Click on the map"
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Great spot!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Why is this place interesting?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSubmit} disabled={!coords || isPending}>
                {isPending ? "Saving..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
