"use client";

import Image from "next/image";
import Link from "next/link";

export default function LogoLink() {
  return (
    <Link
      href="/dashboard"
      className="text-primary hover:opacity-80 md:mx-6 flex items-center"
    >
      <h2 className="font-extrabold text-xl tracking-tight whitespace-nowrap flex items-center gap-2">
        <Image
          alt="Web logo"
          src="/VisData/blueglobaltales.png"
          width={50}
          height={50}
          className="rounded-md"
        />
      </h2>
    </Link>
  );
}
