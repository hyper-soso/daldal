import Link from "next/link";

interface Props {
  isCurrent: boolean;
  name: string;
  href: string;
}

export function CategoryChip({ isCurrent, name, href }: Props) {
  return (
    <li className="shrink-0">
      <Link
        aria-current={isCurrent ? "page" : undefined}
        href={href}
        className="block p-2 px-4 text-sm font-medium bg-custom-100 rounded hover:bg-custom-400 aria-[current='page']:bg-custom-400 transition-all"
      >
        {name}
      </Link>
    </li>
  );
}
