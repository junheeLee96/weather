import { ReadonlyURLSearchParams } from "next/navigation";

export default function Board({
  searchParams,
}: {
  searchParams: ReadonlyURLSearchParams;
}) {
  console.log(searchParams);
  return <div>gdgdg</div>;
}
