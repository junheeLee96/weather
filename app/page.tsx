import { ReadonlyURLSearchParams } from "next/navigation";
import Board from "./ui/Board";
import MyMap from "./gmap/googleMap";
import { Suspense } from "react";
import Script from "next/script";
const key = process.env.API_DIGITAL_TWIN_KEY;
export default function Page({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  const url = `https://map.vworld.kr/js/vworldMapInit.js.do?version=2.0&apiKey=${key}&domain=https://localhost`;
  return (
    <div className="min-w-[100vw] min-h-[100vh] bg-white">
      <div style={{ width: "100%", height: "500px" }}>
        <MyMap />
      </div>
      <div>
        <Board />
      </div>
    </div>
  );
}
