import { ReadonlyURLSearchParams } from "next/navigation";

import Board from "./ui/Board";
import MyMap from "./gmap/googleMap";

export default function Page({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  return (
    <div className="min-w-[100vw] min-h-[100vh] bg-white">
      <div style={{ width: "100%", height: "300px" }}>
        <MyMap />
      </div>
      <Board searchParams={searchParams} />
    </div>
  );
}
