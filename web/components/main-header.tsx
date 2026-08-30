import { Logo } from "./nav/logo";

export function MainHeader() {
  return (
    <header className="p-4 md:p-8 bg-custom-400 rounded">
      <h1 className="text-4xl md:text-6xl font-bold">단거주의보</h1>
      <h2 className="md:mt-4 text-lg md:text-4xl font-bold">
        음료 속 영양성분
      </h2>
      <Logo className="block mt-32 ml-auto w-fit" />
    </header>
  );
}
