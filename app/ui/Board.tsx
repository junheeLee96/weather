import City from "./card/city";
import Chart from "./card/chart";

export default async function Board({ searchParams }: any) {
  const { lat, lng } = searchParams;

  // const data = await satelliteData({
  //   // lat: Number(lat),
  //   // lon: Number(lon),
  //   lat: searchParams.lat,
  //   lon: searchParams.lng,
  // });

  // return <div style={{ color: "black" }}>{data && <Card data={data} />}</div>;
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: "90%",
        }}
      >
        <City searchParams={searchParams} />
        <Chart searchParams={searchParams} />
      </div>
    </div>
  );
}
