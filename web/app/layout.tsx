import "./globals.css";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { pretendard } from "@/lib/fonts";
import { Topnav } from "@/components/nav/top-nav";
import { Footer } from "@/components/nav/footer";

export const metadata: Metadata = {
  title: {
    default: "단거주의보",
    template: "%s | 단거주의보",
  },
  description:
    "카페 메뉴 속 당류 함량을 한눈에! 디저트와 음료의 당 정보를 쉽게 확인하세요.",
  keywords: [
    "단거주의보",
    "카페 음료 당류",
    "당류 분석",
    "디저트 당 함량",
    "음료 당 정보",
    "스타벅스 당류",
    "메가커피 메뉴",
    "당 줄이기",
    "당류 비교 서비스",
  ],
  authors: [{ name: "김현석", url: "https://mrbonk97.github.io" }],
  creator: "김현석",
  publisher: "단거주의보",
  openGraph: {
    title: "단거주의보",
    description:
      "카페 메뉴 속 당류 함량을 한눈에! 디저트와 음료의 당 정보를 쉽게 확인하세요.",
    url: process.env.API_URL!,
    siteName: "단거주의보",
    images: [
      {
        url: `${process.env.API_URL!}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "단거주의보 썸네일",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "단거주의보",
    description:
      "카페 메뉴 속 당류 함량을 한눈에! 디저트와 음료의 당 정보를 쉽게 확인하세요.",
    images: [`${process.env.API_URL!}/opengraph-image.jpg`],
  },
  category: "health",
};

interface Props {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: Props) {
  return (
    <html lang="ko" className={`${pretendard.className} antialiased`}>
      <body className="text-custom-700">
        <Topnav />
        {children}
        {modal}
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-DF72KVPE6S" />
    </html>
  );
}
