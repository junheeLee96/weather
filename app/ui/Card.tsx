export default function Card({ data }: any) {
  const { daily, hourly, minutely } = data;
  console.log(daily, hourly, minutely);
  //   let category = "daily";
  return (
    <div>
      <div>
        <span>일별</span>
        <span>시간별</span>
        <span>분별</span>
      </div>
    </div>
  );
}
