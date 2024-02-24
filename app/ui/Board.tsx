import City from "./card/city";
import Graph from "./card/graph";

export default async function Board({ searchParams }: any) {
  console.log(typeof searchParams);

  const { lat, lng } = searchParams;

  // const data = await satelliteData({
  //   // lat: Number(lat),
  //   // lon: Number(lon),
  //   lat: searchParams.lat,
  //   lon: searchParams.lng,
  // });

  // return <div style={{ color: "black" }}>{data && <Card data={data} />}</div>;
  return (
    <div style={{ color: "red" }}>
      <City searchParams={searchParams} />
      <Graph searchParams={searchParams} />
    </div>
  );
}
