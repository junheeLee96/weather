import { satelliteData } from "../data/data";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import Card from "./Card";
type BoardType = {
  searchParams?: any;
};

export default async function Board({ searchParams = undefined }: BoardType) {
  //   console.log(lat, lon);
  const data = await satelliteData({
    lat: searchParams.lat,
    lon: searchParams.lng,
  });

  return <div>{data && <Card />}</div>;
}
