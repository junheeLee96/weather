import { ReadonlyURLSearchParams } from "next/navigation";
import Board from "./ui/Board";
import MyMap from "./ui/gmap/googleMap";
import { Suspense } from "react";
import Script from "next/script";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
config.autoAddCss = false;
const key = process.env.API_DIGITAL_TWIN_KEY;
export default function Page({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  return (
    <div className="min-w-[100vw] min-h-[100vh] bg-white">
      <div>
        {/* <FontAwesomeIcon icon={faCloudArrowDown} style={{ color: "red" }} /> */}
        <MyMap />
      </div>
      <Board searchParams={searchParams} />
    </div>
  );
}
