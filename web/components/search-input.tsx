"use client";

import { useState } from "react";

interface SearchInputProps {
  initialQuery: string;
}

export function SearchInput({ initialQuery }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <input
      name="q"
      type="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색어를 입력해주세요"
      className="w-full rounded-full bg-secondary p-2 pl-12 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
