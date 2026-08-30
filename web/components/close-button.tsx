"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-4 md:top-8 right-4 md:right-8 cursor-pointer"
    >
      <X />
    </button>
  );
}
