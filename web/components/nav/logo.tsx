import { croissantOne } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return (
    <Link
      href="/"
      className={cn(
        `text-2xl font-bold text-custom-900 ${croissantOne.className}`,
        className,
      )}
    >
      Daldal
    </Link>
  );
}
