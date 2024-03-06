import { getCity } from "@/app/data/data";

export default async function City({ searchParams }: any) {
  const { lat, lng } = searchParams;

  const data: null | string = await getCity({ lat, lng });

  return (
    <div
      style={{
        color: "black",
        fontWeight: "600",
        margin: "1.5rem 0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {data && data}
    </div>
  );
}
