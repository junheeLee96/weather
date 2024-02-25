"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Infos from "./Infos";
import Weekly from "./weekly";

export const K = 273.15;
export const PADDING = 20;

export default function Chart({ searchParams }: any) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = useState<null | CanvasRenderingContext2D>(null);
  const [weathers, setWeathers] = useState<any>(null);
  const [xStep, setXStep] = useState<any>(null);
  const { lat, lng } = searchParams;

  async function draw({ lat, lng }: any) {
    if (!ctx) return;
    if (!ref.current) return;
    const weather = await axios.get("http://localhost:3002/get_satelliteData", {
      params: { lat, lng },
    });

    if (!weather || weather.status !== 200) return;
    setWeathers({
      weather: weather.data,
      category: "hourly",
    });
    const { hourly } = weather.data;
    let avg: number = 0;
    let sum_temps: number = 0;
    let min: number = 99;
    let max: number = 0;
    const data = [];
    for (let i = 0; i < hourly.length; i++) {
      const temp = Number((Number(hourly[i].temp) - K).toFixed(1));
      data.push(temp);

      if (temp > max) {
        max = temp;
      }

      if (temp < min) {
        min = temp;
      }
      sum_temps += temp;
    }

    avg = Number((sum_temps / hourly.length).toFixed(1));

    const pad = PADDING;
    const chartInnerWidth = ref.current.width - 2 * pad;
    const chartInnerHeight = ref.current.height - 2 * pad;
    const nY = max - min + 1;
    const nX = data.length;
    const blockWidth = chartInnerWidth / (nX + 1);
    if (xStep !== blockWidth) {
      setXStep(blockWidth);
    }
    const blockHeight = chartInnerHeight / (nY + 1);
    const xOnCvs = [pad + blockWidth];
    const yOnCvs = [pad + chartInnerHeight - blockHeight * (data[0] - min + 1)];
    const PI = 3;
    for (let i = 1; i < data.length; ++i) {
      xOnCvs.push(pad + (i + 1) * blockWidth);
      yOnCvs.push(pad + chartInnerHeight - blockHeight * (data[i] - min + 1));
    }
    let x = xOnCvs[0];
    let y = yOnCvs[0];
    ctx.fillStyle = "black";
    ctx.font = "16px malgum gothic";
    ctx.fillText(`${String(data[0])} °`, x, y - 10);
    ctx.strokeStyle = "rgb(222, 226, 232)";
    // console.log(yOnCvs);
    ctx.fillStyle = "rgb(222, 226, 232)";
    ctx.beginPath();
    ctx.arc(x, y, PI, 0, 2 * Math.PI);
    ctx.fill();
    // ctx.arc(pad, pad, PI, 0, 2 * Math.PI);
    // ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
    //   ctx.strokeStyle = "rgb(222, 226, 232)";
    ctx.lineWidth = 0.5;
    ctx.lineTo(x, ref.current.height);
    ctx.stroke();

    for (let i = 1; i < nX; ++i) {
      ctx.fillStyle = "rgb(222, 226, 232)";
      const nextx = xOnCvs[i];
      const nexty = yOnCvs[i];
      //원 그리기
      //   ctx.fillStyle = "rgb(222, 226, 232)";
      ctx.moveTo(x, y);
      ctx.beginPath();
      ctx.arc(nextx, nexty, PI, 0, 2 * Math.PI);
      ctx.fill();

      //   ctx.fillStyle = "white";
      //   ctx.arc(nextx, nexty, PI + 0.5, 0, 2 * Math.PI);
      //   ctx.fill();
      //   // 온도 표시
      ctx.fillStyle = "black";
      ctx.fillText(`${String(data[i])} °`, nextx - 10, nexty - 10);

      //막대
      ctx.beginPath();
      ctx.moveTo(nextx, nexty);
      //   ctx.strokeStyle = "rgb(222, 226, 232)";
      ctx.lineWidth = 0.5;
      ctx.lineTo(nextx, ref.current.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(xOnCvs[i - 1], yOnCvs[i - 1]);
      ctx.lineWidth = 2;
      ctx.lineTo(nextx, nexty);
      ctx.stroke();

      x = nextx;
      y = nexty;
    }

    //
  }

  useEffect(() => {
    if (!ctx) return;
    if (!ref.current) return;
    ctx.clearRect(0, 0, ref.current.width, ref.current.height);
    draw({ lat, lng });
  }, [lat, lng]);

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current;
    if (!canvas) return;
    canvas.width = 2500 + PADDING * 2;
    canvas.height = 80 + PADDING * 2;
    console.log(canvas.width, canvas.height);
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
  }, []);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid rgb(240,240,242)",
          borderRadius: "16px",
          width: "100%",
          overflowX: "scroll",
          overflowY: "hidden",
          padding: "20px 0",
        }}
      >
        <canvas id="chart" ref={ref} />
        <Infos weathers={weathers} xStep={xStep} />
      </div>
      <Weekly weathers={weathers} />
    </div>
  );
}
