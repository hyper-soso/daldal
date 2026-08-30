import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 카페 로고는 public/logos/*.svg 로컬 파일이다.
    // next/image 최적화기는 기본적으로 SVG 를 거부하므로 명시적으로 허용하되,
    // 스크립트 실행을 막는 CSP 를 함께 건다.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline'",
  },
};

export default nextConfig;
