import { Cafe } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface Props {
  cafe: Cafe;
}

export function CafeList({ cafe }: Props) {
  return (
    <li>
      <Link
        href={`/cafes/${cafe.id}`}
        className="block p-4 md:p-8 rounded bg-custom-100 hover:bg-custom-200 cursor-pointer duration-300 group"
      >
        <h4 className="text-lg font-semibold group-hover:font-bold duration-300">
          {cafe.name_kor}
        </h4>
        <Image
          src={cafe.logo_url}
          height={256}
          width={256}
          priority
          alt={cafe.name_kor}
          className="my-4 mx-auto h-24 w-24 object-contain md:h-32 md:w-32"
        />
        <div className="h-4" />
      </Link>
    </li>
  );
}
