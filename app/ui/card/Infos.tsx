import React from "react";
import { PADDING } from "./chart";

const Infos = ({ weathers, xStep }: any) => {
  console.log(weathers);
  return (
    <div
      style={{
        width: "100%",
        padding: `0 ${PADDING * 2 + 6}px`,
        display: "flex",
      }}
    >
      {weathers &&
        weathers.weather[weathers.category].map((info: any, idx: number) => (
          <div
            key={idx}
            style={{
              minWidth: `${xStep}px`,
              minHeight: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <img
              src={`https://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png`}
              alt=""
            />
            <div style={{ textAlign: "center", color: "black" }}>
              {new Date(info.dt * 1000).getHours().toString().padStart(2, 0)}시
            </div>
          </div>
        ))}
    </div>
  );
};

export default Infos;
