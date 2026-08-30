"use client";

import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function ModalOverlay({ children }: Props) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-100 p-4 md:p-8 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => router.back()}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
