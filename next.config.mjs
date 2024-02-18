/** @type {import('next').NextConfig} */

// const { createProxyMiddleware } = require("http-proxy-middleware");

const nextConfig = {
  reactStrictMode: false,
  crossOrigin: "anonymous",
  async rewrites() {
    return [
      {
        source: "/req/data/:path*",
        destination: "https://api.vworld.kr/req/data/:path*",
      },
    ];
  },

  // async serverMiddleware() {
  //   // 프록시 미들웨어 설정
  //   const proxy = createProxyMiddleware("/req/data/", {
  //     target: "https://api.vworld.kr", // 실제 백엔드 서버 주소로 변경
  //     changeOrigin: true,
  //   });

  //   // Next.js 서버에 프록시 미들웨어 추가
  //   return (app) => {
  //     app.use(proxy);
  //   };
  // },
};

export default nextConfig;
