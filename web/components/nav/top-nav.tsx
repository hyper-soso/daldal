"use client";

import Form from "next/form";
import { Logo } from "./logo";
import { Search } from "lucide-react";
import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { SearchInput } from "../search-input";

// 내부 컴포넌트로 분리
function TopnavContent() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      setIsVisible(currentScrollY <= lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const initialQuery =
    pathname === "/search" ? (searchParams.get("q") ?? "") : "";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full md:translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Logo />

        <Form action="/search" className="relative w-full max-w-xs md:max-w-sm">
          <button
            type="submit"
            aria-label="검색"
            className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer"
          >
            <Search size={18} />
          </button>

          <SearchInput
            // 주의: URL이 타이핑마다 바뀐다면 key 속성은 제거하고 defaultValue로 초기값만 설정하는 것이 좋습니다.
            key={pathname === "/search" ? "search-page" : "other-page"}
            initialQuery={initialQuery}
          />
        </Form>
      </div>
    </nav>
  );
}

// Suspense로 감쌈
export function Topnav() {
  return (
    <Suspense
      fallback={
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background">
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
            <Logo />
            <div className="w-full max-w-xs md:max-w-sm h-10 bg-muted animate-pulse rounded-md" />
          </div>
        </nav>
      }
    >
      <TopnavContent />
    </Suspense>
  );
}
