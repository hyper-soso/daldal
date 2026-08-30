"use client";

import { CircleAlert } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <main className="p-4 md:p-8 min-h-[calc(100svh-420px)] flex flex-col items-center justify-center">
      <CircleAlert size={64} className="text-rose-400" />

      <header className="mt-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold">문제가 발생했습니다.</h1>

        <p className="mt-4 text-sm md:text-base text-muted-foreground">
          요청을 처리하는 중 오류가 발생했습니다.
        </p>
      </header>

      <pre className="p-4 md:p-8 mt-8 w-full max-w-3xl overflow-x-auto rounded-lg border bg-muted text-sm">
        {error.message}
      </pre>

      <button
        onClick={reset}
        className="py-2 px-4 mt-8 rounded-lg bg-rose-100 text-sm font-medium transition-all hover:bg-rose-200 cursor-pointer"
      >
        다시 시도
      </button>
    </main>
  );
}
