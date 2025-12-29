"use client";

import { useRef, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePostsStore } from "@/store/usePostsStore";


export default function MapLeaflet() {
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null); // stores the leaflet map instance after initialization (so i dont recreate it on every render)
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const { points, fetchPosts } = usePostsStore(); // loads posts from supabase, it doesnt need setstate becouse it is globally runed.
  const [searchValue, setSearchValue] = useState("")
  const searchMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapDivRef.current) return; //checks if mapRef.current exists (to avoid re-initializing)

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
    map.on("click", onClick); //click handle should be created once, otherwise we will have multiple of them (same as map L)

          fetchPosts(); //fetching happens on initialisation and every time router or fetchposts change
  }, [router, fetchPosts]); 
 
useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const logoIcon = L.icon({
      iconUrl: "/VisData/camera-logo.png",
      iconSize: [45, 45],
      iconAnchor: [10, 10],
      popupAnchor: [0, -22],
    });

    const markers: L.Marker[] =  points.map((p) => {
      const marker = L.marker([p.lat, p.lng], { icon: logoIcon })
        .addTo(map)
        .bindPopup(`
          <div style="width:240px">
            <div style="font:600 14px/1.2 system-ui;margin-bottom:6px">${p.title}</div>
            <img src="${p.imageUrl}" alt="${p.title}" style="width:100%;border-radius:12px;margin-top:4px"/>
            ${p.description ? `<p style="margin-top:6px">${p.description}</p>` : ""}
          </div>
        `);
      return marker;
    });
  });
  

  const goToCoordinates = () => {
  if (!mapRef.current) return;

  const match = searchValue
    .trim()
    .match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);

  if (!match) {
    alert("Use format: lat, lng");
    return;
  }

  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[3]);

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    alert("Invalid coordinates");
    return;
  }

  const map = mapRef.current;

  map.flyTo([lat, lng], 15, { duration: 0.8 });

  if (searchMarkerRef.current) {
    searchMarkerRef.current.remove();
  }

  searchMarkerRef.current = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`Lat: ${lat}<br/>Lng: ${lng}`)
    .openPopup();
};




 return (
  <>
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-xl shadow-lg flex overflow-hidden">
      <input
        type="text"
        placeholder="lat, lng (e.g. 41.7151, 44.8271)"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && goToCoordinates()}
        className="px-4 py-2 w-72 outline-none text-sm"
      />
      <button
        onClick={goToCoordinates}
        className="px-4 bg-black text-white text-sm"
      >
        Go
      </button>
    </div>

    <div ref={mapDivRef} className="absolute inset-0" />
  </>
);
}
 // in react router object can change between renders, for example during hot reload or navigation
   //by puting router in the dependency list, we ensure : if router changes effect reruns, and click handler uses the latest router.




   //  Summary of what happens in this component:
//
//   When MapLeaflet first mounts, useEffect() runs once:
//     - Creates the Leaflet map inside the <div> (centered on Tbilisi).
//     - Adds the MapTiler tile layer for map visuals.
//     - Attaches a "click" event listener: when the user clicks on the map,
//       it takes that latitude/longitude and navigates to
//       `/create?lat=<lat>&lng=<lng>` (opens CreatePost page).
//     - Calls fetchPosts() to load posts from Supabase.
//
//  fetchPosts() (from Zustand store) fetches posts → calls set({ points: pts })
//     - Zustand updates its global "points" state with all fetched posts.
//     - React automatically re-renders this component with new points.
//
//    Second useEffect() runs whenever "points" changes:
//     - Removes any old markers from the map.
//     - Loops through each point and creates a Leaflet marker
//       with an icon, title, image, and description popup.
//     - Adds those markers to the map.
//
//   Result:
//     - The map shows all posts as clickable markers.
//     - When you add a new post (and call fetchPosts again),
//       "points" updates in Zustand → this component re-renders
//       → the markers refresh automatically.
//
//  In short:
// useEffect #1 = map setup + initial fetch
// useEffect #2 = display markers whenever points update