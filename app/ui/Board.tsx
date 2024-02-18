import { getPolygon, satelliteData } from "../data/data";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Card from "./Card";

export default async function Board({ searchParams }: any) {
  //   const poly: any = await getPolygon();
  //   console.log(poly.data.response.result);
  //   console.log("poly = ", poly.data.response.result.featureCollection.bbox);
  //   console.log(lat, lon);

  //   const searchParams = useSearchParams();
  //   const pathname = usePathname();
  //   console.log(pathname);
  //   const { replace } = useRouter();
  //   const lat = searchParams.get("lat");
  //   const lon = searchParams.get("lat");
  //   const category = searchParams.get("category");

  //   if (!category) {
  //     const params = new URLSearchParams(searchParams);
  //     params.set("page", "1");
  //     params.delete("query");
  //     replace(`${pathname}?${params.toString()}`);
  //   }
  const data = await satelliteData({
    // lat: Number(lat),
    // lon: Number(lon),
    lat: null,
    lon: null,
  });

  return <div style={{ color: "black" }}>{data && <Card data={data} />}</div>;
}
