import { K } from "./chart";

const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
export default function Weekly({ weathers }: any) {
  if (weathers) console.log(weathers.weather);
  return (
    <div
      style={{
        width: "100%",
        color: "black",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        borderRadius: "16px",
        border: "1px solid rgb(240,240,242)",
        padding: "20px",
        gridColumnGap: "20px",
      }}
    >
      <div>주간예보</div>
      <div>최저 최고 기준</div>
      {weathers &&
        weathers.weather?.daily.map((weather: any, idx: number) => (
          <div
            key={idx}
            style={{
              borderBottom: "1px solid rgb(240,240,242)",
              //   borderRight: idx % 2 == 0 ? "1px solid rgb(240,240,242)" : "0",
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 5px",
            }}
          >
            <div>
              <div>
                {new Date(weather.dt * 1000).getDate() === new Date().getDate()
                  ? "오늘"
                  : new Date(weather.dt * 1000).getDate()}
              </div>
              <div>{dayNames[new Date(weather.dt * 1000).getDay()]}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div>{(weather.temp.day - K).toFixed(1)}°</div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                style={{ width: "50px" }}
              />
              {/* <div>{weather.weather[0].description}</div> */}
            </div>
            <div style={{ display: "flex" }}>
              <div>{(weather.temp.min - K).toFixed(1)}°</div>
              <div>/</div>
              <div>{(weather.temp.max - K).toFixed(1)}°</div>
            </div>
          </div>
        ))}
    </div>
  );
}
