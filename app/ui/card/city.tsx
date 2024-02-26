import { getCity } from "@/app/data/data";

export default async function City({ searchParams }: any) {
  const { lat, lng } = searchParams;

  const data: null | string = await getCity({ lat, lng });

  return <div>{data && data}</div>;
}
