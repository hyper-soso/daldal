import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 bg-secondary text-secondary-foreground p-4 md:p-8 pb-48 border-t border-muted">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        {/* 상단: 서비스명 및 약관 링크 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-muted-foreground/20 pb-8 gap-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight">단거주의보</h2>
            <p className="text-sm text-muted-foreground mt-2">
              음료 속 영양성분 정보 서비스
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            <Link
              href="/terms"
              className="hover:underline text-muted-foreground hover:text-foreground transition"
            >
              이용약관
            </Link>
            <Link
              href="/policy"
              className="hover:underline text-muted-foreground hover:text-foreground transition"
            >
              개인정보 처리방침
            </Link>
          </div>
        </div>

        {/* 하단: 프로젝트 정보 및 저작권 */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span className="font-medium">HyperSoso</span>
              <span className="text-muted-foreground/40">|</span>
              <span>운영자: 김현석</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              <span>문의: hyunsuk1997@naver.com</span>
            </div>
          </div>

          {/* Copyright는 가상 회사(팀) 이름이나 서비스 이름 둘 다 가능하지만, 보통 주체를 명시합니다 */}
          <div className="whitespace-nowrap mt-4 md:mt-0">
            <p>© {new Date().getFullYear()} HyperSoso. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
