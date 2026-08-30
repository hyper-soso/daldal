import { SearchX } from "lucide-react";

export default function ErrorPage() {
  return (
    <main className="p-4 md:p-8 min-h-[calc(100svh-420px)] flex flex-col items-center justify-center">
      <SearchX size={64} className="text-rose-400" />

      <header className="mt-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">
          페이지를 찾을 수 없습니다.
        </h1>

        <p className="mt-4 text-sm md:text-base text-muted-foreground">
          주소가 잘못되었거나 삭제된 페이지입니다.
        </p>
      </header>
    </main>
  );
}
